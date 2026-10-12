import { chromium } from 'file:///C:/Users/zhang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/assets');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(`
  <canvas id="c" width="1920" height="1080"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const particles = Array.from({ length: 130 }, (_, i) => ({
      x: (i * 149) % W,
      y: (i * 211) % H,
      r: 0.8 + (i % 5) * 0.34,
      s: 0.28 + (i % 7) * 0.05
    }));
    function draw(t) {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#05070a');
      g.addColorStop(0.48, '#081019');
      g.addColorStop(1, '#020306');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.globalAlpha = 0.42;
      ctx.strokeStyle = 'rgba(242,223,68,.14)';
      ctx.lineWidth = 1;
      for (let x = -W; x < W * 1.5; x += 74) {
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(t * 0.001) * 20, 0);
        ctx.lineTo(x + 520, H);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,255,255,.06)';
      for (let y = 80; y < H; y += 86) {
        ctx.beginPath();
        ctx.moveTo(0, y + Math.cos(t * 0.001 + y) * 8);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();
      const pulse = (Math.sin(t * 0.0016) + 1) / 2;
      const radial = ctx.createRadialGradient(W * .76, H * .36, 20, W * .76, H * .36, 620);
      radial.addColorStop(0, 'rgba(242,223,68,' + (0.28 + pulse * 0.08) + ')');
      radial.addColorStop(0.42, 'rgba(242,223,68,.07)');
      radial.addColorStop(1, 'rgba(242,223,68,0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, W, H);
      const gold = ctx.createRadialGradient(W * .56, H * .72, 0, W * .56, H * .72, 420);
      gold.addColorStop(0, 'rgba(242,223,68,.18)');
      gold.addColorStop(1, 'rgba(242,223,68,0)');
      ctx.fillStyle = gold;
      ctx.fillRect(0, 0, W, H);
      ctx.lineCap = 'round';
      for (let i = 0; i < 7; i++) {
        const y = 270 + i * 72 + Math.sin(t * 0.001 + i) * 30;
        const x = 640 + Math.cos(t * 0.0007 + i) * 180;
        const grad = ctx.createLinearGradient(x - 300, y, x + 460, y + 80);
        grad.addColorStop(0, 'rgba(242,223,68,0)');
        grad.addColorStop(0.5, i % 2 ? 'rgba(242,223,68,.5)' : 'rgba(255,255,255,.42)');
        grad.addColorStop(1, 'rgba(242,223,68,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2 + i % 3;
        ctx.beginPath();
        ctx.moveTo(x - 340, y);
        ctx.bezierCurveTo(x - 80, y - 150, x + 160, y + 180, x + 520, y + 40);
        ctx.stroke();
      }
      for (const p of particles) {
        p.x += p.s;
        if (p.x > W + 20) p.x = -20;
        ctx.fillStyle = 'rgba(226,248,252,.55)';
        ctx.beginPath();
        ctx.arc(p.x, p.y + Math.sin(t * 0.001 + p.x) * 10, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = 'rgba(5,7,10,.16)';
      ctx.fillRect(0, 0, W, H);
    }
    window.record = async () => {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.start();
      const start = performance.now();
      await new Promise(resolve => {
        function frame(now) {
          draw(now);
          if (now - start < 4200) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
      await new Promise(resolve => {
        recorder.onstop = resolve;
        recorder.stop();
      });
      const blob = new Blob(chunks, { type: 'video/webm' });
      const buffer = await blob.arrayBuffer();
      return Array.from(new Uint8Array(buffer));
    };
  </script>
`);

const bytes = await page.evaluate(() => window.record());
await writeFile(resolve(outDir, 'hero-visual-loop.webm'), Buffer.from(bytes));
await browser.close();
