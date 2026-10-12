#!/usr/bin/env node
/**
 * compress:assets —— 通用静态资源压缩器
 * ---------------------------------------------------------------------------
 * 一条命令完成：
 *   1. 扫描 index.html 与 src/，找出所有被引用的 public/assets 资源
 *   2. 图片(jpg/jpeg/png) → 自适应参数转 WebP，并自动改写源码里的引用路径
 *   3. 视频(mp4)         → ffmpeg 重编码（h264 CRF + faststart + 去音轨）
 *   4. 报告没有被任何源码引用的「僵尸资源」，可用 --prune 一并归档
 *
 * 设计原则：可重复执行。压过的文件不会被二次压缩（图片已转为 webp 后不再匹配，
 * 视频靠 .asset-manifest.json + 码率下限双重判断），原始文件移入项目外的备份目录。
 *
 * 用法：
 *   npm run compress:assets                 正常压缩
 *   npm run compress:assets -- --dry-run    只报告体积，不写任何文件
 *   npm run compress:assets -- --no-video   只压图片，跳过视频
 *   npm run compress:assets -- --prune      顺带把未被引用的资源移入备份
 *   npm run compress:assets -- --lazy       顺带给 <img> 补 loading="lazy"
 *   npm run compress:assets -- --force      已压过的也重新压一遍
 *   npm run compress:assets -- --help       查看全部参数
 */

import sharp from 'sharp';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

/* ============================== 可调参数 ============================== */

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const ASSETS_DIR = path.join(ROOT, 'public', 'assets');

/** 参与「引用扫描 / 路径改写」的源码位置（相对项目根） */
const SOURCE_ENTRIES = ['index.html', 'src'];
/** 源码文件后缀 */
const SOURCE_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.css', '.html']);

/** 会被处理的图片后缀 */
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png']);
/** 会被处理的视频后缀 */
const VIDEO_EXT = new Set(['.mp4']);

/** 图片自适应预设：从上往下依次尝试，一旦达到收益阈值就采用 */
const IMAGE_PRESETS = [
  { width: 2560, quality: 82 },
  { width: 2000, quality: 78 },
  { width: 1800, quality: 74 },
];
/** 图片至少要省下这个比例才替换，否则保留原图（避免「越压越大」） */
const IMAGE_MIN_SAVINGS = 0.2;

/** 视频默认 CRF（18 无感 / 23 高质量 / 26 均衡 / 28 激进）；可按文件名覆盖 */
const VIDEO_CRF = 25;
const VIDEO_CRF_OVERRIDES = { 'hero-background.mp4': 23 };
const VIDEO_PRESET = 'slow';
/** 码率已低于此值(kbps)视为「压过了」，跳过重编码；防止反复压缩掉画质 */
const VIDEO_SKIP_BELOW_KBPS = 2500;
/** 编码结果没省下这个比例就回滚 */
const VIDEO_MIN_SAVINGS = 0.05;
/**
 * 编码尝试阶梯。低内存环境（容器/沙箱）里 x264 默认多线程会 malloc 失败，
 * 因此逐级退让：先让 ffmpeg 自动，再限 2 线程、1 线程，最后连 preset 降到 medium。
 */
const VIDEO_ATTEMPTS = [
  { threads: 0, preset: VIDEO_PRESET },
  { threads: 2, preset: VIDEO_PRESET },
  { threads: 1, preset: VIDEO_PRESET },
  { threads: 1, preset: 'medium' },
];

/** 记录已处理的视频，避免重复编码（文件被替换时 hash 变化会自动重压） */
const MANIFEST_PATH = path.join(ROOT, '.asset-manifest.json');

/* ============================== 参数解析 ============================== */

function flagArg(name) {
  const hit = process.argv.slice(2).find((a) => a === name || a.startsWith(`${name}=`));
  if (!hit) return undefined;
  const eq = hit.indexOf('=');
  return eq === -1 ? '' : hit.slice(eq + 1);
}

const opt = {
  dryRun: process.argv.includes('--dry-run'),
  video: !process.argv.includes('--no-video'),
  prune: process.argv.includes('--prune'),
  lazy: process.argv.includes('--lazy'),
  force: process.argv.includes('--force'),
  keepOriginals: process.argv.includes('--keep-originals'),
  help: process.argv.includes('--help') || process.argv.includes('-h'),
  quiet: process.argv.includes('--quiet'),
  backup:
    flagArg('--backup') ||
    path.join(path.dirname(ROOT), `${path.basename(ROOT)}__assets-原始备份`),
  ffmpeg: flagArg('--ffmpeg') || process.env.FFMPEG_PATH || '',
};

/* ============================== 小工具 ============================== */

const MB = (n) => `${(n / 1048576).toFixed(2)} MB`;
const ratio = (a, b) => (b > 0 ? `${(a / b).toFixed(1)}x` : '-');
const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);
const uniqSuffix = (p) => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}${path.extname(p)}`;

function walk(dir, filter) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, filter));
    else if (!filter || filter(p)) out.push(p);
  }
  return out;
}

const stamp = () => new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

/** 跨盘符安全移动：先试 rename，失败则 copy + unlink */
async function moveFile(from, to) {
  await fsp.mkdir(path.dirname(to), { recursive: true });
  try {
    await fsp.rename(from, to);
  } catch {
    await fsp.copyFile(from, to);
    await fsp.unlink(from);
  }
}

/**
 * 归档原始文件 —— 关键：绝不覆盖备份目录里已有的文件。
 *   · 目标不存在            → 正常移入
 *   · 目标存在且内容相同    → 只删源，避免重复占空间
 *   · 目标存在但内容不同    → 另存为 xxx-20261012153740.ext，两份都保留
 */
async function archiveFile(from, to) {
  await fsp.mkdir(path.dirname(to), { recursive: true });
  let dest = to;
  if (fs.existsSync(dest)) {
    if (fs.statSync(dest).size === fs.statSync(from).size && sha1(dest) === sha1(from)) {
      await fsp.unlink(from);
      return dest;
    }
    const ext = path.extname(to);
    dest = path.join(path.dirname(to), `${path.basename(to, ext)}-${stamp()}${ext}`);
  }
  try {
    await fsp.rename(from, dest);
  } catch {
    await fsp.copyFile(from, dest);
    await fsp.unlink(from);
  }
  return dest;
}

/** 有并发上限的 map */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    for (;;) {
      const i = cursor++;
      if (i >= items.length) return;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

function sha1(file) {
  return crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex');
}

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return { videos: {} };
  }
}

async function saveManifest(m) {
  await fsp.writeFile(MANIFEST_PATH, `${JSON.stringify(m, null, 2)}\n`);
}

/* ============================== 引用扫描 ============================== */

const ASSET_RE = /assets\/([A-Za-z0-9._@%/-]+\.(?:jpe?g|png|gif|svg|webp|avif|mp4|webm|mov))/gi;

function sourceFiles() {
  const files = [];
  for (const entry of SOURCE_ENTRIES) {
    const p = path.join(ROOT, entry);
    if (!fs.existsSync(p)) continue;
    if (fs.statSync(p).isFile()) files.push(p);
    else files.push(...walk(p, (f) => SOURCE_EXT.has(path.extname(f).toLowerCase())));
  }
  return files;
}

function collectRefs(files) {
  const refs = new Set();
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(ASSET_RE)) refs.add(decodeURIComponent(m[1]));
  }
  return refs;
}

/* ============================== 图片压缩 ============================== */

/**
 * 在内存里按预设逐个试，取体积最小的结果；达到收益阈值即提前收束。
 * 返回 { buffer, preset, size } 或 null。
 */
async function buildBestWebp(abs, srcSize) {
  let best = null;
  for (const preset of IMAGE_PRESETS) {
    const buffer = await sharp(abs)
      .rotate()
      .resize({ width: preset.width, withoutEnlargement: true })
      .webp({ quality: preset.quality, effort: 5 })
      .toBuffer();
    if (!best || buffer.length < best.size) best = { buffer, preset, size: buffer.length };
    if (buffer.length <= srcSize * (1 - IMAGE_MIN_SAVINGS)) break;
  }
  return best;
}

/* ============================== 视频压缩 ============================== */

async function findFfmpeg() {
  const candidates = [
    opt.ffmpeg,
    path.join(ROOT, '.cache', 'ffmpeg', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
    path.join(ROOT, 'node_modules', 'ffmpeg-static', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
    path.join(ROOT, 'node_modules', '@ffmpeg-installer', `${process.platform}-${process.arch}`, process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
  ].filter(Boolean);

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  // 最后尝试 PATH 里的 ffmpeg
  try {
    await execFileAsync('ffmpeg', ['-version']);
    return 'ffmpeg';
  } catch {
    return null;
  }
}

/** ffmpeg -i 不指定输出文件时退出码为 1，信息全在 stderr */
async function probeVideo(ff, file) {
  const res = await execFileAsync(ff, ['-hide_banner', '-i', file], { maxBuffer: 1 << 24 }).catch((e) => e);
  const text = `${res?.stderr || ''}${res?.stdout || ''}`;
  const bitrate = Number(text.match(/bitrate:\s*(\d+)\s*kb\/s/)?.[1] || 0);
  const d = text.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
  const duration = d ? Number(d[1]) * 3600 + Number(d[2]) * 60 + parseFloat(d[3]) : 0;
  const v = text.match(/Video:\s*([^,]+),\s*([^,]+),\s*(\d+)x(\d+)/);
  return { bitrate, duration, codec: v?.[1]?.trim() || '?', size: v ? `${v[3]}x${v[4]}` : '?' };
}

async function encodeVideo(ff, abs, crf, { threads, preset }) {
  const tmp = `${abs}.tmp-${uniqSuffix(abs)}`;
  const args = ['-v', 'error', '-y'];
  if (threads) args.push('-threads', String(threads));
  args.push(
    '-i', abs,
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v', 'libx264', '-crf', String(crf), '-preset', preset,
    '-pix_fmt', 'yuv420p', '-profile:v', 'high',
    '-movflags', '+faststart', '-an',
    tmp,
  );
  try {
    await execFileAsync(ff, args, { maxBuffer: 1 << 26 });
  } catch (err) {
    await fsp.unlink(tmp).catch(() => {}); // 失败不留半成品
    throw err;
  }
  return tmp;
}

/** 按阶梯逐级尝试，返回临时文件路径；全部失败则抛最后一个错误 */
async function encodeVideoResilient(ff, abs, crf) {
  let lastErr;
  for (const attempt of VIDEO_ATTEMPTS) {
    try {
      const tmp = await encodeVideo(ff, abs, crf, attempt);
      return { tmp, attempt };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

/* ============================== 懒加载 ============================== */

async function addLazyLoading() {
  const files = [
    ...walk(path.join(ROOT, 'src'), (f) => ['.jsx', '.tsx'].includes(path.extname(f).toLowerCase())),
    path.join(ROOT, 'index.html'),
  ];
  let total = 0;
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const src = fs.readFileSync(f, 'utf8');
    let hits = 0;
    const next = src.replace(/<img\b([^>]*?)\/?>/g, (m, attrs) => {
      if (/\bloading=/.test(attrs)) return m;
      hits += 1;
      return `<img${attrs} loading="lazy" decoding="async" />`;
    });
    if (hits) {
      if (!opt.dryRun) await fsp.writeFile(f, next);
      total += hits;
      if (!opt.quiet) console.log(`  ${pad(path.relative(ROOT, f), 34)} +${hits} 个 img`);
    }
  }
  return total;
}

/* ============================== 主流程 ============================== */

function printHelp() {
  console.log(`
compress:assets —— 通用静态资源压缩器

  npm run compress:assets [-- 参数...]

参数
  --dry-run          只扫描并报告，不修改任何文件
  --no-video         跳过视频，只处理图片
  --prune            把未被任何源码引用的资源移入备份目录
  --lazy             给源码里的 <img> 补上 loading="lazy" decoding="async"
  --force            已压过的文件也重新压一遍
  --keep-originals   保留原始文件（默认移入备份目录）
  --backup=<目录>    指定备份目录，默认 ../<项目名>__assets-原始备份
  --ffmpeg=<路径>    指定 ffmpeg 可执行文件，也可用环境变量 FFMPEG_PATH
  --quiet            精简输出
  -h, --help         显示本帮助

备份目录：${opt.backup}
`);
}

async function main() {
  if (opt.help) return printHelp();

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`未找到资源目录：${ASSETS_DIR}`);
    process.exitCode = 1;
    return;
  }

  const t0 = Date.now();
  const srcFiles = sourceFiles();
  const refs = collectRefs(srcFiles);

  console.log(`\n项目根目录  ${ROOT}`);
  console.log(`资源目录    ${ASSETS_DIR}`);
  console.log(`源码文件    ${srcFiles.length} 个，引用资源 ${refs.size} 个`);
  if (opt.dryRun) console.log('模式        仅报告（--dry-run），不会修改任何文件');
  console.log('');

  /* ---------- 分类 ---------- */
  const images = []; // { rel, srcMissing }
  const videos = [];
  const missing = [];
  for (const rel of [...refs].sort()) {
    const ext = path.extname(rel).toLowerCase();
    if (!fs.existsSync(path.join(ASSETS_DIR, rel))) {
      // 中断自愈：原图已归档、WebP 已生成，只差源码引用没改写
      const twin = rel.replace(/\.(jpe?g|png)$/i, '.webp');
      if (twin !== rel && fs.existsSync(path.join(ASSETS_DIR, twin))) {
        images.push({ rel, srcMissing: true });
        continue;
      }
      missing.push(rel);
      continue;
    }
    if (IMAGE_EXT.has(ext)) images.push({ rel, srcMissing: false });
    else if (VIDEO_EXT.has(ext)) videos.push(rel);
  }

  const mapping = []; // { from, to, before, after }
  let beforeBytes = 0;
  let afterBytes = 0;

  /* ---------- 1. 图片 → WebP ---------- */
  console.log('── 图片 ──────────────────────────────────────────────────────────────');
  if (!images.length) {
    console.log('  没有需要处理的 jpg/png 引用（可能已全部转为 WebP）');
  } else {
    console.log(
      `  ${pad('文件', 36)}${padL('原始', 10)}${padL('优化后', 10)}${padL('比例', 8)}  参数`,
    );
    const rows = await mapLimit(images, 4, async ({ rel, srcMissing }) => {
      const abs = path.join(ASSETS_DIR, rel);
      const outRel = rel.replace(/\.(jpe?g|png)$/i, '.webp');
      const outAbs = path.join(ASSETS_DIR, outRel);

      // 上次运行中断（原图已归档、WebP 已生成）：只需补写引用
      if (srcMissing) {
        const size = fs.statSync(outAbs).size;
        return { rel, outRel, before: size, after: size, note: '原图已归档，补写引用', adopted: true, existed: true, recovered: true };
      }

      const srcSize = fs.statSync(abs).size;

      // 已经转过：只补一次引用改写
      if (fs.existsSync(outAbs) && !opt.force) {
        return { rel, outRel, before: srcSize, after: fs.statSync(outAbs).size, note: 'WebP 已存在，仅更新引用', adopted: true, existed: true };
      }

      const best = await buildBestWebp(abs, srcSize);
      const adopted = best && best.size < srcSize * (1 - IMAGE_MIN_SAVINGS);
      if (adopted && !opt.dryRun) await fsp.writeFile(outAbs, best.buffer);

      return {
        rel,
        outRel,
        before: srcSize,
        after: adopted ? best.size : srcSize,
        note: adopted ? `w${best.preset.width} q${best.preset.quality}` : '压缩无收益，保留原图',
        adopted,
        existed: false,
      };
    });

    for (const r of rows) {
      console.log(
        `  ${pad(r.rel, 36)}${padL(MB(r.before), 10)}${padL(MB(r.after), 10)}${padL(r.adopted ? ratio(r.before, r.after) : '-', 8)}  ${r.note}`,
      );
      beforeBytes += r.before;
      afterBytes += r.after;

      if (!r.adopted) continue;
      if (r.outRel !== r.rel) mapping.push({ from: r.rel, to: r.outRel });

      // 归档原始文件（已存在的 webp 说明早前已归档过）
      if (!r.existed && !opt.keepOriginals && !opt.dryRun) {
        await archiveFile(path.join(ASSETS_DIR, r.rel), path.join(opt.backup, r.rel));
      }
    }
  }

  /* ---------- 2. 视频重编码 ---------- */
  let videoSaved = 0;
  const failedVideos = [];
  console.log('\n── 视频 ──────────────────────────────────────────────────────────────');
  if (!opt.video) {
    console.log('  已通过 --no-video 跳过');
  } else if (!videos.length) {
    console.log('  没有 mp4 引用');
  } else {
    const ff = await findFfmpeg();
    if (!ff) {
      console.log('  ⚠ 未找到 ffmpeg，跳过视频压缩。任选一种方式即可启用：');
      console.log('    · 安装到 PATH：winget install Gyan.FFmpeg');
      console.log(`    · 把 ffmpeg 可执行文件放到 ${path.join(ROOT, '.cache', 'ffmpeg')}`);
      console.log('    · npm i -D ffmpeg-static');
      console.log('    · 指定路径：npm run compress:assets -- --ffmpeg=D:/tools/ffmpeg.exe');
    } else {
      console.log(`  ffmpeg: ${ff}`);
      const manifest = loadManifest();
      for (const rel of videos) {
        const abs = path.join(ASSETS_DIR, rel);
        const srcSize = fs.statSync(abs).size;
        const before = await probeVideo(ff, abs);
        const rec = manifest.videos?.[rel];

        // 幂等：文件被替换时 hash 变化，会自动重压
        if (!opt.force && rec && rec.size === srcSize && rec.sha1 === sha1(abs)) {
          console.log(`  ${pad(rel, 30)}${padL(MB(srcSize), 12)}  已处理过，跳过`);
          beforeBytes += srcSize;
          afterBytes += srcSize;
          continue;
        }
        if (!opt.force && before.bitrate && before.bitrate < VIDEO_SKIP_BELOW_KBPS) {
          console.log(`  ${pad(rel, 30)}${padL(MB(srcSize), 12)}  码率仅 ${before.bitrate} kbps，跳过`);
          // 记进清单，后续运行走 hash 精确判断，不再依赖码率阈值
          if (!opt.dryRun) {
            manifest.videos ??= {};
            manifest.videos[rel] = { size: srcSize, sha1: sha1(abs), date: new Date().toISOString(), mode: 'skip-lean', bitrate: before.bitrate };
          }
          beforeBytes += srcSize;
          afterBytes += srcSize;
          continue;
        }

        const crf = VIDEO_CRF_OVERRIDES[rel] ?? VIDEO_CRF;
        if (opt.dryRun) {
          console.log(`  ${pad(rel, 30)}${padL(MB(srcSize), 12)}  计划重编码 CRF${crf}（${before.size}, ${before.duration.toFixed(1)}s, ${before.bitrate} kbps）`);
          beforeBytes += srcSize;
          afterBytes += srcSize;
          continue;
        }

        // 单个视频失败不影响其他文件，按阶梯自动降级重试
        let encoded;
        try {
          encoded = await encodeVideoResilient(ff, abs, crf);
        } catch (err) {
          const reason = String(err?.stderr || err?.message || err).trim().split('\n').filter(Boolean).pop() || '未知错误';
          console.log(`  ${pad(rel, 30)}${padL(MB(srcSize), 12)}  ✗ 编码失败，已跳过：${reason}`);
          failedVideos.push(rel);
          beforeBytes += srcSize;
          afterBytes += srcSize;
          continue;
        }

        const outSize = fs.statSync(encoded.tmp).size;
        if (outSize >= srcSize * (1 - VIDEO_MIN_SAVINGS)) {
          await fsp.unlink(encoded.tmp).catch(() => {});
          console.log(`  ${pad(rel, 30)}${padL(MB(srcSize), 12)}  无收益，保留原文件`);
          beforeBytes += srcSize;
          afterBytes += srcSize;
          continue;
        }

        try {
          if (!opt.keepOriginals) await archiveFile(abs, path.join(opt.backup, rel));
          else await fsp.unlink(abs);
          await fsp.rename(encoded.tmp, abs);
        } catch (err) {
          await fsp.unlink(encoded.tmp).catch(() => {});
          console.log(`  ${pad(rel, 30)}${padL(MB(srcSize), 12)}  ✗ 写入失败，原文件未改动：${err?.message || err}`);
          failedVideos.push(rel);
          beforeBytes += srcSize;
          afterBytes += srcSize;
          continue;
        }

        manifest.videos ??= {};
        manifest.videos[rel] = {
          size: outSize,
          sha1: sha1(abs),
          date: new Date().toISOString(),
          crf,
          threads: encoded.attempt.threads || 'auto',
        };
        videoSaved += srcSize - outSize;

        const ladder = encoded.attempt.threads ? `, ${encoded.attempt.threads}线程` : '';
        console.log(
          `  ${pad(rel, 30)}${padL(MB(srcSize), 12)} → ${padL(MB(outSize), 10)}  ${padL(ratio(srcSize, outSize), 7)}  CRF${crf}${ladder}`,
        );
        beforeBytes += srcSize;
        afterBytes += outSize;
      }
      if (!opt.dryRun) await saveManifest(manifest);
    }
  }

  /* ---------- 3. 改写引用 ---------- */
  if (mapping.length && !opt.dryRun) {
    console.log('\n── 更新源码引用 ──────────────────────────────────────────────────────');
    let total = 0;
    for (const f of srcFiles) {
      let src = fs.readFileSync(f, 'utf8');
      let hits = 0;
      for (const m of mapping) {
        const parts = src.split(`assets/${m.from}`);
        // 第一个元素是首个匹配之前的内容，>1 说明有命中
        if (parts.length > 1) {
          hits += parts.length - 1;
          src = parts.join(`assets/${m.to}`);
        }
      }
      if (hits) {
        await fsp.writeFile(f, src);
        total += hits;
        console.log(`  ${pad(path.relative(ROOT, f), 34)} ${hits} 处`);
      }
    }
    console.log(`  合计改写 ${total} 处引用`);

    // 残留失效引用检查
    const left = srcFiles.flatMap((f) => {
      const src = fs.readFileSync(f, 'utf8');
      return mapping.filter((m) => src.includes(`assets/${m.from}`)).map((m) => `${path.relative(ROOT, f)} → ${m.from}`);
    });
    console.log(left.length ? `  ⚠ 仍有 ${left.length} 处未更新：\n    ${left.join('\n    ')}` : '  ✓ 无残留失效引用');
  } else if (mapping.length && opt.dryRun) {
    console.log(`\n── 更新源码引用 ── 计划改写 ${mapping.length} 个路径（--dry-run 未执行）`);
  }

  /* ---------- 4. 懒加载 ---------- */
  if (opt.lazy) {
    console.log('\n── 图片懒加载 ────────────────────────────────────────────────────────');
    const n = await addLazyLoading();
    console.log(`  共 ${n} 个 <img> 已补充 loading="lazy"`);
  }

  /* ---------- 5. 僵尸资源 ---------- */
  const usedNow = collectRefs(srcFiles);
  const onDisk = walk(ASSETS_DIR, (f) => !/\.tmp[-.]/.test(path.basename(f)))
    .map((p) => path.relative(ASSETS_DIR, p).split(path.sep).join('/'));
  const orphans = onDisk.filter((rel) => !usedNow.has(rel)).sort();

  console.log('\n── 未被引用的资源 ────────────────────────────────────────────────────');
  if (!orphans.length) {
    console.log('  无（所有资源都在被使用）');
  } else {
    let orphanBytes = 0;
    for (const rel of orphans) {
      const size = fs.statSync(path.join(ASSETS_DIR, rel)).size;
      orphanBytes += size;
      console.log(`  ${pad(rel, 46)}${padL(MB(size), 10)}`);
    }
    console.log(`  共 ${orphans.length} 个，合计 ${MB(orphanBytes)}`);
    if (opt.prune && opt.dryRun) {
      console.log('  （--dry-run：未执行归档，去掉 --dry-run 后这些文件会被移入备份）');
    } else if (opt.prune) {
      for (const rel of orphans) {
        await archiveFile(path.join(ASSETS_DIR, rel), path.join(opt.backup, '未引用', rel));
      }
      console.log(`  已移入备份 → ${path.join(opt.backup, '未引用')}`);
    } else {
      console.log('  如需一并归档，重跑时加 --prune');
    }
  }

  /* ---------- 6. 汇总 ---------- */
  console.log('\n── 汇总 ──────────────────────────────────────────────────────────────');
  if (beforeBytes) {
    console.log(`  本次处理体积  ${MB(beforeBytes)} → ${MB(afterBytes)}   （${ratio(beforeBytes, afterBytes)}）`);
  }
  const finalBytes = walk(ASSETS_DIR, () => true).reduce((s, p) => s + fs.statSync(p).size, 0);
  const finalCount = walk(ASSETS_DIR, () => true).length;
  console.log(`  public/assets ${MB(finalBytes)} ／ ${finalCount} 个文件`);
  console.log(`  原始文件备份  ${opt.keepOriginals ? '（--keep-originals，保持原样）' : opt.backup}`);
  console.log(`  耗时          ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  if (failedVideos.length) {
    console.log(`\n⚠ 有 ${failedVideos.length} 个视频编码失败（原文件保持不动，可稍后重跑）：`);
    for (const v of failedVideos) console.log(`    ${v}`);
  }
  if (missing.length) {
    console.log(`\n⚠ 有 ${missing.length} 个引用指向不存在的文件（源码里写了但资源缺失）：`);
    for (const m of missing) console.log(`    ${m}`);
  }
  console.log('');
}

main().catch((err) => {
  console.error('\n执行失败：', err?.message || err);
  process.exitCode = 1;
});
