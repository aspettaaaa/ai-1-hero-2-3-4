import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Award,
  BookMarked,
  Bot,
  Boxes,
  Brush,
  CalendarCheck,
  ClipboardList,
  Cpu,
  FolderCheck,
  LayoutGrid,
  Mail,
  Megaphone,
  MonitorPlay,
  PackageCheck,
  Palette,
  Phone,
  ScanSearch,
  Sparkles,
  Target,
  UserCog,
} from 'lucide-react';
import { contacts, experiences, heroDetails, metrics, profile, projects, strengths } from './data.js';
import Aurora from './components/Aurora.jsx';
import BorderGlow from './components/BorderGlow.jsx';

const navItems = [
  { label: '首页', href: '#hero' },
  { label: '经历', href: '#about' },
  { label: '项目', href: '#projects' },
  { label: '优势', href: '#strengths' },
  { label: '联系', href: '#contact' },
];

const icons = [Brush, Bot, MonitorPlay, Boxes, Sparkles, Award];

function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frameId = 0;
    const particles = Array.from({ length: 90 }, (_, index) => ({
      x: (index * 149) % 1920,
      y: (index * 211) % 1080,
      r: 0.9 + (index % 5) * 0.34,
      s: 0.35 + (index % 7) * 0.05,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = (time) => {
      const width = canvas.width;
      const height = canvas.height;
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#08060d');
      gradient.addColorStop(0.5, '#0f0a18');
      gradient.addColorStop(1, '#030206');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const pulse = (Math.sin(time * 0.0016) + 1) / 2;
      const radial = ctx.createRadialGradient(width * 0.76, height * 0.36, 20, width * 0.76, height * 0.36, 620);
      radial.addColorStop(0, `rgba(182,118,255,${0.26 + pulse * 0.08})`);
      radial.addColorStop(0.42, 'rgba(182,118,255,.07)');
      radial.addColorStop(1, 'rgba(182,118,255,0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.s;
        if (particle.x > 1940) particle.x = -20;
        ctx.fillStyle = 'rgba(226,248,252,.45)';
        ctx.beginPath();
        ctx.arc(
          (particle.x / 1920) * width,
          (particle.y / 1080) * height + Math.sin(time * 0.001 + particle.x) * 10,
          particle.r,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      });

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />;
}

function spotlightMove(event) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  element.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
  element.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
}

function spotlightLeave(event) {
  const element = event.currentTarget;
  element.style.removeProperty('--spot-x');
  element.style.removeProperty('--spot-y');
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#hero" aria-label="返回首页">
        <span className="brand-mark">ZW</span>
        <span>张子薇</span>
      </a>
      <nav aria-label="主导航">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="nav-contact" href={`mailto:${profile.email}`}>
        <Mail size={16} />
        联系我
      </a>
    </header>
  );
}

function StudioProjectDetail({ project }) {
  const { detail } = project;
  const projectNumber = String(projects.findIndex((item) => item.detailSlug === project.detailSlug) + 1).padStart(2, '0');
  const studioSections = detail.studioSections ?? [];

  return (
    <div className="project-detail-page studio-detail-page">
      <header className="site-header detail-header">
        <a className="detail-back" href="#projects">
          <ArrowLeft size={16} />
          返回作品集
        </a>
        <span className="detail-header-label">PROJECT / {projectNumber}</span>
        <a className="nav-contact" href={`mailto:${profile.email}`}>
          <Mail size={16} />
          联系我
        </a>
      </header>

      <div className="studio-detail-flow">
        <article className="studio-detail-row studio-detail-row--intro">
          <div className="detail-visual-column studio-detail-visual">
            <div className="detail-visual-intro">
              <span>{detail.eyebrow}</span>
              <strong>{detail.subtitle}</strong>
            </div>
            <figure className="detail-media-item">
              <img src={detail.images[0].src} alt={detail.images[0].alt} loading="lazy" decoding="async" />
              <figcaption>{detail.images[0].caption}</figcaption>
            </figure>
          </div>

          <aside className="studio-detail-copy">
            <div className="detail-copy-inner">
              <span className="hero-kicker">{detail.eyebrow}</span>
              <h1 className="detail-title--stacked">{detail.displayTitle}</h1>
              <p className="detail-role">{detail.role}</p>
              <p className="detail-overview">{detail.overview}</p>
              <div className="detail-meta-grid detail-meta-grid--editorial">
                {detail.meta.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
              <div className="detail-section">
                <span className="detail-section-label">MY ROLE</span>
                <h2>从视觉实验到可持续的个人创作方法</h2>
                <ul>
                  {detail.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
              <div className="detail-footer-note">
                <span>{detail.period}</span>
                <a href="#projects">
                  查看其他项目
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </aside>
        </article>

        {detail.images.slice(1).map((image, index) => {
          const section = studioSections[index];

          return (
            <article className="studio-detail-row" key={image.src}>
              <div className="detail-visual-column studio-detail-visual studio-detail-visual--continuation">
                <figure className="detail-media-item">
                  <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                  <figcaption>{image.caption}</figcaption>
                </figure>
              </div>

              <aside className="studio-detail-copy">
                <div className="detail-copy-inner">
                  <span className="detail-section-label">STUDIO PROJECT / {String(index + 2).padStart(2, '0')}</span>
                  <h2 className="studio-section-title">{section.title}</h2>
                  <p className="detail-role">{section.role}</p>
                  <p className="detail-overview">{section.overview}</p>

                  {section.flow && (
                    <div className="studio-flow-line">
                      <span className="detail-section-label">CORE LOOP</span>
                      <strong>{section.flow}</strong>
                    </div>
                  )}

                  {section.paragraphs && (
                    <div className="studio-paragraphs">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}

                  {section.sections && (
                    <div className="studio-section-list">
                      {section.sections.map((item) => (
                        <div key={item.title}>
                          <strong>{item.title}</strong>
                          <p>{item.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.closing && <p className="studio-closing">{section.closing}</p>}
                </div>
              </aside>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* 「品牌视觉体系全链路建设」流程图 —— 用 HTML 排版重建原设计稿版式。
   数据来自 data.js 的 detail.followupWorkflow，按 section.kind 切换四种版式。 */
const workflowIcons = {
  ClipboardList,
  Target,
  LayoutGrid,
  CalendarCheck,
  Palette,
  Boxes,
  Cpu,
  Megaphone,
  ScanSearch,
  PackageCheck,
  FolderCheck,
  BookMarked,
};

function WorkflowSectionBody({ section }) {
  if (section.kind === 'cards') {
    return (
      <div className="wf-cards">
        {section.items.map((item) => {
          const Icon = workflowIcons[item.icon] ?? LayoutGrid;
          return (
            <div className="wf-card" key={item.title}>
              <span className="wf-card-icon" aria-hidden="true">
                <Icon size={15} strokeWidth={1.9} />
              </span>
              <strong>{item.title}</strong>
              {item.note && <em>{item.note}</em>}
            </div>
          );
        })}
      </div>
    );
  }

  if (section.kind === 'collab') {
    return (
      <div className="wf-collab">
        <div className="wf-hub">
          <span className="wf-hub-icon" aria-hidden="true">
            <UserCog size={18} strokeWidth={1.8} />
          </span>
          <strong>{section.hub.label}</strong>
          <em>{section.hub.meta}</em>
        </div>
        <div className="wf-ring">
          {section.hub.ring.map((ring) => (
            <span key={ring}>{ring}</span>
          ))}
        </div>
        <ul className="wf-teams">
          {section.teams.map((team) => {
            const Icon = workflowIcons[team.icon] ?? Boxes;
            return (
              <li key={team.name}>
                <span className="wf-team-icon" aria-hidden="true">
                  <Icon size={14} strokeWidth={1.9} />
                </span>
                <div>
                  <strong>
                    {team.name}
                    {team.tag && <b>{team.tag}</b>}
                  </strong>
                  <p>{team.points.join(' · ')}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="wf-output">
          <span className="wf-output-label">协同产出</span>
          <div className="wf-output-tags">
            {section.outputs.map((output) => (
              <span key={output}>{output}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section.kind === 'parallel') {
    return (
      <div className="wf-parallel">
        <ul className="wf-tracks">
          {section.tracks.map((track) => (
            <li key={track}>{track}</li>
          ))}
        </ul>
        <div className="wf-flow">
          {section.flow.map((step, index) => (
            <div className="wf-flow-step" key={step}>
              <span className="wf-step">{step}</span>
              {index < section.flow.length - 1 && (
                <ArrowDown className="wf-flow-arrow" size={13} strokeWidth={2} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.kind === 'supplier') {
    return (
      <div className="wf-supplier">
        <span className="wf-party">{section.from}</span>
        <ArrowDown className="wf-supplier-arrow" size={14} strokeWidth={2} aria-hidden="true" />
        <div className="wf-bridge">
          {section.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <ArrowDown className="wf-supplier-arrow" size={14} strokeWidth={2} aria-hidden="true" />
        <span className="wf-party">{section.to}</span>
      </div>
    );
  }

  return null;
}

function WorkflowDiagram({ data }) {
  return (
    <div className="wf">
      <header className="wf-head">
        <span className="wf-kicker">{data.kicker}</span>
        <h2>{data.title}</h2>
        <p>{data.subtitle}</p>
      </header>

      <ol className="wf-sections">
        {data.sections.map((section) => (
          <li className="wf-section" key={section.no}>
            <div className="wf-section-head">
              <span className="wf-no">{section.no}</span>
              <div className="wf-section-title">
                <h3>{section.title}</h3>
                <p>{section.meta}</p>
              </div>
            </div>
            <WorkflowSectionBody section={section} />
          </li>
        ))}
      </ol>

      <div className="wf-outro">
        <div className="wf-footer">
          <strong>{data.footer.title}</strong>
          <span>{data.footer.note}</span>
        </div>
        <span className="wf-brand">{data.brand}</span>
      </div>
    </div>
  );
}

function ProjectDetail({ project }) {
  const { detail } = project;

  const isBoleProject = project.detailSlug === 'bole-brand-operations';
  const isAnkouProject = project.detailSlug === 'ankou-cultural-design';
  const isStudioProject = project.detailSlug === 'studio-visual-experiment';
  if (isStudioProject) {
    return <StudioProjectDetail project={project} />;
  }
  const projectNumber = String(projects.findIndex((item) => item.detailSlug === project.detailSlug) + 1).padStart(2, '0');
  const followupTitle = isBoleProject
    ? '让品牌内容成为持续发生的传播资产'
    : isAnkouProject
      ? '让传统文化成为可持续的当代视觉资产'
      : isStudioProject
        ? '从视觉实验到可持续的个人创作方法'
        : '从品牌战略到可持续的视觉资产';
  const hasFollowupImage = !isAnkouProject && !isStudioProject && Boolean(detail.images[1]);

  return (
    <div className="project-detail-page">
      <header className="site-header detail-header">
        <a className="detail-back" href="#projects">
          <ArrowLeft size={16} />
          返回作品集
        </a>
        <span className="detail-header-label">PROJECT / {projectNumber}</span>
        <a className="nav-contact" href={`mailto:${profile.email}`}>
          <Mail size={16} />
          联系我
        </a>
      </header>

      <div className="project-detail-flow">
        <div
          className={`detail-feature-layout${isAnkouProject ? ' detail-feature-layout--ankou' : isStudioProject ? ' detail-feature-layout--studio' : hasFollowupImage ? '' : ' detail-feature-layout--single'}`}
        >
          {isAnkouProject ? (
            <div className="detail-visual-column detail-feature-visual detail-ankou-visual" aria-label="安口窑文创设计视频与长图">
              <div className="detail-visual-intro">
                <span>{detail.eyebrow}</span>
                <strong>{detail.subtitle}</strong>
              </div>
              <div className="detail-video-grid">
                {detail.videos.map((video) => (
                  <figure className="detail-video-item" key={video.src}>
                    <video autoPlay muted loop playsInline preload="metadata" aria-label={video.alt}>
                      <source src={video.src} type="video/mp4" />
                    </video>
                  </figure>
                ))}
              </div>
              <div className="detail-longform-stack">
                {detail.images.map((image) => (
                  <figure className="detail-media-item" key={image.src}>
                    <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`detail-visual-column detail-feature-visual${isStudioProject ? ' detail-studio-visual' : ''}`}
              aria-label="项目首屏视觉"
            >
              <div className="detail-visual-intro">
                <span>{detail.eyebrow}</span>
                <strong>{detail.subtitle}</strong>
              </div>
              {isStudioProject ? (
                <div className="detail-longform-stack detail-studio-gallery">
                  {detail.images.map((image) => (
                    <figure className="detail-media-item" key={image.src}>
                      <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                      <figcaption>{image.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : (
                <figure className="detail-media-item">
                  <img src={detail.images[0].src} alt={detail.images[0].alt} loading="lazy" decoding="async" />
                  <figcaption>{detail.images[0].caption}</figcaption>
                </figure>
              )}
            </div>
          )}

          <aside className={`detail-copy-column${isStudioProject ? ' detail-studio-copy-column' : ''}`}>
            <div className="detail-copy-inner">
              <span className="hero-kicker">{detail.eyebrow}</span>
              <h1 className={detail.displayTitle ? 'detail-title--stacked' : undefined}>{detail.displayTitle ?? project.title}</h1>
              <p className="detail-role">{detail.role}</p>
              <p className="detail-overview">{detail.overview}</p>
              {detail.responsibilities && (
                <div className="detail-responsibility">
                  <span className="detail-section-label">我的职责</span>
                  <p>{detail.responsibilities}</p>
                </div>
              )}
              <div className={`detail-meta-grid${detail.displayTitle ? ' detail-meta-grid--editorial' : ''}`}>
                {detail.meta.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
              {!hasFollowupImage && (
                <>
                  <div className="detail-section">
                    <span className="detail-section-label">MY ROLE</span>
                    <h2>{followupTitle}</h2>
                    <ul>
                      {detail.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="detail-footer-note">
                    <span>{detail.period}</span>
                    <a href="#projects">
                      查看其他项目
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>

        {hasFollowupImage && (
          <div
            className={`detail-followup-layout${detail.followupWorkflow ? ' detail-followup-layout--workflow' : ''}`}
          >
            <div className="detail-visual-column detail-followup-visual" aria-label="项目延展视觉">
              <figure className="detail-media-item">
                <img src={detail.images[1].src} alt={detail.images[1].alt} loading="lazy" decoding="async" />
                <figcaption>{detail.images[1].caption}</figcaption>
              </figure>
            </div>

            <aside
              className={`detail-followup-copy${detail.followupWorkflow ? ' detail-followup-copy--workflow' : ''}`}
            >
              <div className="detail-copy-inner">
                {detail.followupWorkflow ? (
                  <WorkflowDiagram data={detail.followupWorkflow} />
                ) : (
                  <div className="detail-section">
                    <span className="detail-section-label">MY ROLE</span>
                    <h2>{followupTitle}</h2>
                    <ul>
                      {detail.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="detail-footer-note">
                  <span>{detail.period}</span>
                  <a href="#projects">
                    查看其他项目
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        )}

        {!isAnkouProject && !isStudioProject && detail.images[2] && (
          <div
            className={`detail-tail-layout${detail.followupWorkflow ? ' detail-tail-layout--joined' : ''}`}
          >
            <div className="detail-visual-column detail-tail-visual" aria-label="项目IP视觉">
              <figure className="detail-media-item">
                <img src={detail.images[2].src} alt={detail.images[2].alt} loading="lazy" decoding="async" />
                <figcaption>{detail.images[2].caption}</figcaption>
              </figure>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero section-shell" id="hero">
      <video
        className="hero-video"
        poster="/assets/hero-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/assets/hero-background.mp4" type="video/mp4" />
      </video>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-copy">
          <span className="hero-kicker">VISUAL DESIGNER</span>
          <h1>张子薇</h1>
          <p>{profile.heroTitle}</p>
          <div className="hero-actions">
            <a className="primary-button" href="#projects">
              查看作品
              <ArrowUpRight size={18} />
            </a>
            <a className="ghost-button" href={`mailto:${profile.email}`}>
              <Mail size={18} />
              {profile.email}
            </a>
          </div>
          <div className="hero-proof">
            {heroDetails.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperiencePoint({ point }) {
  const numberedMatch = point.match(/^(\d{2})｜([^｜]+)｜(.*)$/);
  const plainMatch = point.match(/^([^｜]+)｜(.*)$/);

  if (numberedMatch) {
    const [, , title, description] = numberedMatch;

    return (
      <>
        <strong className="timeline-point-title">{title}</strong>｜{description}
      </>
    );
  }

  if (plainMatch) {
    const [, title, description] = plainMatch;

    return (
      <>
        <strong className="timeline-point-title">{title}</strong>｜{description}
      </>
    );
  }

  return point;
}

function About() {
  return (
    <section className="section-shell about" id="about">
      <div className="aurora-backdrop" aria-hidden="true">
        <Aurora
          colorStops={["#3a0a71", "#b676ff", "#6e47a5"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.7}
        />
      </div>
      <div className="section-heading">
        <h2>个人经历</h2>
      </div>
        <div className="about-grid">
          <div className="portrait-panel">
          <img src="/assets/portrait-photo.webp" alt="张子薇个人照片" loading="lazy" decoding="async" />
          <div>
            <strong>{profile.role}</strong>
            <span>Brand / IP / Motion / AI</span>
          </div>
        </div>
        <div className="about-main">
          <div className="lead">
            {profile.aboutIntro.map((paragraph, index) => (
              <p className={index === 0 ? 'lead-heading' : ''} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className="contact-strip">
            {contacts.map((item) =>
              item.href ? (
                <a key={item.label} href={item.href}>
                  <span>{item.label}</span>
                  {item.value}
                </a>
              ) : (
                <div key={item.label}>
                  <span>{item.label}</span>
                  {item.value}
                </div>
              ),
            )}
          </div>
          <div className="metric-grid">
            {metrics.map((item) => (
              <div className="metric-card" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="timeline">
        {experiences.map((item) => (
          <article className="timeline-item" key={item.company}>
            <div>
              <span>{item.period}</span>
              <h3>{item.company}</h3>
              <p>{item.role}</p>
            </div>
            <ul>
              {item.points.map((point) => (
                <li key={point}>
                  <ExperiencePoint point={point} />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section-shell projects" id="projects">
      <div className="section-heading wide-heading">
        <h2>精选项目</h2>
        <p>以四个代表性项目建立作品集主线，覆盖品牌视觉、运营传播、文创设计与个人实验。</p>
      </div>
      <div className="project-stack">
        {projects.map((project, index) => {
          const Card = project.detailSlug ? 'a' : 'article';
          const cardProps = project.detailSlug
            ? {
                href: `#project/${project.detailSlug}`,
                'aria-label': `查看${project.title}详情`,
              }
            : {};

          return (
            <Card
              className={`project-card hover-surface${project.coverVideo ? ' project-card--video' : ''}`}
              key={project.title}
              onPointerMove={spotlightMove}
              onPointerLeave={spotlightLeave}
              {...cardProps}
            >
            <div className="project-image">
              {project.coverVideo ? (
                <video
                  className="project-cover-video"
                  poster={project.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={`${project.title}视频封面`}
                >
                  <source src={project.coverVideo} type="video/mp4" />
                </video>
              ) : (
                <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
              )}
            </div>
            <div className="project-copy">
              <span>{String(index + 1).padStart(2, '0')} / {project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="tag-row">
                {project.stats.map((stat) => (
                  <em key={stat}>{stat}</em>
                ))}
              </div>
              {project.cta && (
                <span className="project-cta">
                  {project.cta}
                  <ArrowUpRight size={16} />
                </span>
              )}
            </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function Strengths() {
  return (
    <section className="section-shell strengths" id="strengths">
      <div className="section-heading wide-heading">
        <h2>个人优势</h2>
      </div>
      <div className="strength-grid">
        {strengths.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <BorderGlow
              className="strength-glow"
              key={item.title}
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#120F17"
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1.0}
              coneSpread={25}
              animated={false}
              colors={['#c084fc', '#f472b6', '#38bdf8']}
            >
              <article
                className="strength-card hover-surface"
                onPointerMove={spotlightMove}
                onPointerLeave={spotlightLeave}
              >
                <Icon size={24} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            </BorderGlow>
          );
        })}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-page" id="contact">
      <div className="contact-inner">
        <div>
          <h2>让下一个项目，从一次对话开始。</h2>
          <p>
            期待与您共同探索品牌视觉升级、视觉体系构建、IP开发与全场景设计，也欢迎交流产品内容可视化与 AI 辅助设计工作流。
          </p>
        </div>
        <div className="contact-actions">
          <a className="primary-button large" href={`mailto:${profile.email}`}>
            <Mail size={20} />
            {profile.email}
          </a>
          <a className="ghost-button large" href={`tel:${profile.phone.replaceAll(' ', '')}`}>
            <Phone size={20} />
            {profile.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [detailSlug, setDetailSlug] = useState(
    () => window.location.hash.match(/^#project\/(.+)$/)?.[1] ?? null,
  );

  useEffect(() => {
    const restorePortfolioScroll = () => {
      const shouldRestoreSavedPosition = window.location.hash === '#projects';
      const savedScroll = Number(sessionStorage.getItem('portfolio-scroll-y'));

      if (shouldRestoreSavedPosition && Number.isFinite(savedScroll) && savedScroll > 0) {
        sessionStorage.removeItem('portfolio-scroll-y');
        requestAnimationFrame(() => window.scrollTo({ top: savedScroll, behavior: 'auto' }));
        return;
      }

      const target = document.querySelector(window.location.hash || '#hero');
      if (target) {
        requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
      }
    };

    const syncRoute = () => {
      const nextDetailSlug = window.location.hash.match(/^#project\/(.+)$/)?.[1] ?? null;

      if (nextDetailSlug) {
        sessionStorage.setItem('portfolio-scroll-y', String(window.scrollY));
        setDetailSlug(nextDetailSlug);
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }

      setDetailSlug(null);
      restorePortfolioScroll();
    };

    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  useEffect(() => {
    const update = (event) => {
      document.documentElement.style.setProperty('--mx', `${event.clientX}px`);
      document.documentElement.style.setProperty('--my', `${event.clientY}px`);
    };

    window.addEventListener('pointermove', update);
    update({ clientX: window.innerWidth * 0.5, clientY: window.innerHeight * 0.28 });

    return () => window.removeEventListener('pointermove', update);
  }, []);

  const detailProject = projects.find((project) => project.detailSlug === detailSlug);

  if (detailProject) {
    return <ProjectDetail project={detailProject} />;
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Strengths />
        <Contact />
      </main>
    </>
  );
}







