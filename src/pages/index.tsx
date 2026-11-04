import { useState, useEffect, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useLatestRelease, { findArtifact, formatSize } from '../hooks/useLatestRelease';
import {
  DirectDownloadButton,
  MacAppStoreBadge,
  MicrosoftStoreBadge,
  SnapStoreButton,
  MAC_APP_STORE_URL,
} from '../components/StoreBadge';
import DocentInstall from '../components/DocentInstall';
import { useInstallerUrl } from '../utils/api';
import useVisitorPlatform from '../hooks/useVisitorPlatform';
import styles from './home.module.css';

function Icon({ name }: { name: string }) {
  const props = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'folder': return <svg {...props}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
    case 'file': return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
    case 'scan': return <svg {...props}><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" y1="12" x2="17" y2="12" /></svg>;
    case 'spark': return <svg {...props}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" /></svg>;
    case 'plug': return <svg {...props}><path d="M12 2v6" /><path d="M6 2v6" /><path d="M4 8h10a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-1a2 2 0 0 1 2-2z" /><path d="M9 15v5" /></svg>;
    case 'globe': return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" /></svg>;
    case 'code': return <svg {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
    case 'check': return <svg {...props}><polyline points="20 6 9 17 4 12" /></svg>;
    case 'download': return <svg {...props}><path d="M12 3v12" /><polyline points="7 10 12 15 17 10" /><path d="M5 21h14" /></svg>;
    case 'arrow': return <svg {...props}><line x1="7" y1="17" x2="17" y2="7" /><polyline points="8 7 17 7 17 16" /></svg>;
    default: return null;
  }
}

// The open models the orchestrator routes between, and the machines it fits
// them to. Both drift past the hero and the engine panel.
const MODELS = ['Gemma 4', 'Qwen 3.5', 'Qwen2-VL', 'Ministral 3', 'sl-mini', 'Gemma 3', 'Qwen3', 'Phi'];
const HARDWARE = ['Apple Silicon', 'NVIDIA', 'AMD', 'Intel', 'Integrated graphics', 'Windows 11', 'Linux', 'macOS'];

function Marquee({ items, reverse = false, slow = false }: { items: string[]; reverse?: boolean; slow?: boolean }) {
  // Two copies of the row, translated by half: the seam is invisible.
  const row = [...items, ...items];
  return (
    <div className={styles.marquee}>
      <div className={`${styles.marqueeTrack} ${reverse ? styles.marqueeReverse : ''} ${slow ? styles.marqueeSlow : ''}`}>
        {row.map((item, i) => (
          <span key={i} className={styles.chip}>{item}</span>
        ))}
      </div>
    </div>
  );
}

type Work = {
  key: string;
  icon: string;
  title: string;
  desc: string;
  window: string;
  badge: string;
  rows: { icon: string; label: string; meta: string }[];
  to: string;
};

// Each tab drives the mock window beside it. The rows are what that feature
// looks like in Studio, drawn from the docs it links to.
const WORK: Work[] = [
  {
    key: 'documents',
    icon: 'folder',
    title: 'Documents and projects',
    desc: 'Drop PDFs, Office files and scans into a project. They are indexed on your machine and never uploaded; every answer shows the file it came from.',
    window: 'Halbrook Wren LLP',
    badge: 'indexed',
    rows: [
      { icon: 'file', label: 'MSA-2024.pdf', meta: '24 p' },
      { icon: 'file', label: 'Amendment-1.pdf', meta: '6 p' },
      { icon: 'file', label: '2026-DRAFT.docx', meta: '19 p' },
      { icon: 'file', label: 'Mutual-NDA.pdf', meta: '4 p' },
    ],
    to: '/docs/documents',
  },
  {
    key: 'ocr',
    icon: 'scan',
    title: 'Scans and OCR',
    desc: 'Attach a scan, screenshot or photo and pull structured details out of it. A vision model does the reading, on-device.',
    window: 'invoice-0412.jpg',
    badge: 'qwen2-vl',
    rows: [
      { icon: 'check', label: 'Vendor · Northwind Supply', meta: 'read' },
      { icon: 'check', label: 'Invoice date · 12 Apr 2026', meta: 'read' },
      { icon: 'check', label: 'Total · $4,180.00', meta: 'read' },
      { icon: 'check', label: 'Terms · net 30', meta: 'read' },
    ],
    to: '/docs/documents',
  },
  {
    key: 'skills',
    icon: 'spark',
    title: 'Skills',
    desc: 'Pack the work you repeat into a skill — a markdown file the assistant runs. Type / in the prompt to start one.',
    window: 'Skills',
    badge: '/ to run',
    rows: [
      { icon: 'spark', label: '/issues-list', meta: 'review' },
      { icon: 'spark', label: '/version-compare', meta: 'review' },
      { icon: 'spark', label: '/weekly-summary', meta: 'report' },
      { icon: 'spark', label: '/draft-notice', meta: 'draft' },
    ],
    to: '/docs/skills',
  },
  {
    key: 'connections',
    icon: 'plug',
    title: 'Connections',
    desc: 'Reach outside tools through MCP. Notion, Linear, Trello, monday.com and Canva connect in one click; any other server by URL.',
    window: 'Connections',
    badge: 'mcp',
    rows: [
      { icon: 'plug', label: 'Notion', meta: 'connected' },
      { icon: 'plug', label: 'Linear', meta: 'connected' },
      { icon: 'plug', label: 'Trello', meta: 'one click' },
      { icon: 'plug', label: 'Custom server', meta: 'by url' },
    ],
    to: '/docs/mcp-servers',
  },
  {
    key: 'search',
    icon: 'globe',
    title: 'Web search',
    desc: 'Bring current sources into an answer. Only the query leaves your machine; local models read the pages and cite them.',
    window: 'Sources',
    badge: 'query only',
    rows: [
      { icon: 'globe', label: 'Your documents', meta: '3 files' },
      { icon: 'globe', label: 'Web results', meta: '5 sites' },
      { icon: 'globe', label: 'Read and answered', meta: 'on-device' },
      { icon: 'globe', label: 'Sent off-device', meta: 'query' },
    ],
    to: '/docs/web-search',
  },
  {
    key: 'api',
    icon: 'code',
    title: 'Local API',
    desc: 'An OpenAI-compatible endpoint on localhost for creating projects, uploading documents and wiring Smartloop into your own apps.',
    window: 'localhost',
    badge: 'openai-compatible',
    rows: [
      { icon: 'code', label: 'POST /v1/chat/completions', meta: '200' },
      { icon: 'code', label: 'POST /v1/projects', meta: '201' },
      { icon: 'code', label: 'POST /v1/documents', meta: '201' },
      { icon: 'code', label: 'GET  /v1/models', meta: '200' },
    ],
    to: '/docs/local-ai',
  },
];

// Drawn from the legal starter's own documents (starters/gen_docs.py), so the
// panel shows what the download actually answers.
const legal = {
  run: {
    project: 'Halbrook Wren LLP',
    prompt: 'compare the 2026 draft with the current MSA',
    rows: [
      ['Termination', '60 days, no fee', '90 days + 50% fee', true],
      ['Liability cap', '12 months of fees', '6 months of fees', true],
      ['Change of control', '§4.3 exit right', 'deleted', true],
      ['Non-renewal notice', '120 days', '120 days', false],
    ] as [string, string, string, boolean][],
    refs: ['MSA-2024.pdf', 'Amendment-1.pdf', '2026-DRAFT.docx'],
  },
  points: [
    ['Five agreements.', 'A services agreement with its amendment and 2026 renewal draft, a mutual NDA, and a one-sided supply agreement.'],
    ['Issues list.', 'A first-pass review against a checklist — term, termination, liability, assignment — quoting each clause by section.'],
    ['Version compare.', 'What changed between the signed agreement and the draft, clause by clause.'],
  ] as [string, string][],
  models: [
    ['vision', 'qwen2-vl-2b'],
    ['document processing', 'ministral3-3b'],
    ['reasoning', 'qwen3.5-2b'],
  ] as [string, string][],
  starter: { href: '/starters/Halbrook-Wren-LLP.zip', size: '80 KB' },
};

const steps = [
  ['Install', 'One installer from your platform’s store. On first launch it checks your memory and GPU and fits the models to them.'],
  ['Bring your documents', 'Make a project and drop in your files. They are indexed on your machine. Nothing uploads.'],
  ['Ask', 'The orchestrator splits the request and routes each step to the open model built for it. You never pick one.'],
  ['Take it to the terminal', 'docent runs the same agent, models and projects from your shell, your scripts or over SSH.'],
];

const docs = [
  { to: '/docs/intro', title: 'Introduction', desc: 'Overview of Smartloop and what it can do for you.' },
  { to: '/docs/getting-started', title: 'Getting Started', desc: 'Install Smartloop and run your first local AI session.' },
  { to: '/docs/model-orchestration', title: 'Model Orchestration', desc: 'See how Smartloop routes each task to the right on-device model.' },
  { to: '/docs/skills', title: 'Skills', desc: 'Extend your project with agent skills.' },
  { to: '/docs/mcp-servers', title: 'Connections', desc: 'Connect external tools and services to your AI.' },
  { to: '/docs/local-ai', title: 'Local AI', desc: 'Create AI tools and integrations.' },
];

const faqs = [
  {
    q: 'What is Smartloop?',
    a: 'Smartloop is a local AI assistant that runs entirely on your own machine. You install it and start asking; there are no models to choose, nothing to configure, and no account to create. It reads your documents, connects to your tools, and generates content without sending your data anywhere.',
  },
  {
    q: 'How does Smartloop work?',
    a: 'Smartloop breaks each request into smaller tasks and routes them to the best on-device model. We curate the models it ships with — open small language models including Google’s Gemma family (such as Gemma 3) and Qwen2-VL for vision — and its orchestration model (sl-mini) picks the right one by capability and workload. You never see that choice; you just get the answer.',
  },
  {
    q: 'Do I need to pick a model or configure anything?',
    a: 'No. That is the point. There are hundreds of open models, each with its own file formats, quantizations, and memory requirements, and most people have no reason to learn the difference. Smartloop is opinionated: we curate the models, size them to your machine on first launch, and swap in better ones as they land. There is nothing to choose or configure.',
  },
  {
    q: 'Is Smartloop free?',
    a: 'Yes, Smartloop is free to use, with models that are regularly updated to handle most everyday tasks efficiently. No account or credit card is needed, and it stays free for organizations running it at scale. The one metered part is AI search, which runs through us: every account gets a monthly allowance of searches, and you can buy more from your dashboard. If you want a hand getting it running, you can contact us to set it up and get it working on your data — on-premise deployment, tuning for your use case, rollout across your team, and a dedicated point of contact. Reach us at support@smartloop.ai.',
  },
  {
    q: 'Is my data private and offline?',
    a: 'Yes. Smartloop runs models on-device, so your documents and conversations stay on your machine, and it works offline for most everyday tasks. AI search is the exception: it sends only a search query to find current web information, never your documents or conversation, and you can turn it off per project. Smartloop sizes the models it runs to the memory your machine has. The minimum is an Apple Silicon Mac (M3 or newer) with 16 GB of unified memory, or a Windows 11 / Linux machine with 16 GB of RAM and a Vulkan-capable GPU — integrated Intel, AMD, or NVIDIA graphics all qualify, and the Vulkan runtime ships with the app. More memory is better.',
  },
];

// The ms-windows-store: deep link launches the Store app directly (the user is
// already on Windows here); the download page uses the https web link instead.
const MS_STORE_PROTOCOL = 'ms-windows-store://pdp/?productid=XPDLN9NR8DDLLK';


export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const studioPlatform = useVisitorPlatform();
  const [work, setWork] = useState(0);
  const { release } = useLatestRelease();
  const installerUrl = useInstallerUrl();
  // Latest Docent CLI version, baked in at build time (docusaurus.config.ts).
  const docentVersion = siteConfig.customFields?.docentVersion as string | null | undefined;

  // Mac and Windows lead with our own installer, routed through the tracked
  // redirect on the API: it ships as soon as a release is published and
  // updates itself. Their store is the line underneath, carrying a campaign
  // token naming this page so the hand-off stays attributable in the store's
  // analytics. Linux leads with the Snap Store, with the .deb underneath.
  const dmg = findArtifact(release, 'darwin', 'dmg');
  const exe = findArtifact(release, 'win32', 'nsis');
  const deb = findArtifact(release, 'linux', 'deb');

  const altLine = (href: string, ext: string, size: number) => (
    <p className={styles.ctaAlt}>
      or download the{' '}
      <a className={styles.textLink} href={href} download>.{ext}</a>
      {' '}· {formatSize(size)}
    </p>
  );

  const storeLine = (href: string, preposition: 'on' | 'from', name: string) => (
    <p className={styles.ctaAlt}>
      or get it {preposition} the{' '}
      <a className={styles.textLink} href={href} {...(/^https?:/i.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{name}</a>
    </p>
  );

  // Mac and Windows fall back to their store badge when the release carries no
  // installer for the platform.
  const heroCta: { badge: ReactNode; alt: ReactNode } = (() => {
    if (studioPlatform === 'macos') {
      return dmg
        ? { badge: <DirectDownloadButton platform="macos" />, alt: storeLine(`${MAC_APP_STORE_URL}&ct=web-home`, 'on', 'Mac App Store') }
        : { badge: <MacAppStoreBadge campaign="web-home" />, alt: null };
    }
    if (studioPlatform === 'windows') {
      // The deep link launches the Store app in place.
      return exe
        ? { badge: <DirectDownloadButton platform="windows" />, alt: storeLine(`${MS_STORE_PROTOCOL}&cid=web-home`, 'from', 'Microsoft Store') }
        : { badge: <MicrosoftStoreBadge href={MS_STORE_PROTOCOL} campaign="web-home" />, alt: null };
    }
    if (studioPlatform === 'linux') {
      return { badge: <SnapStoreButton />, alt: deb ? altLine(installerUrl('linux'), 'deb', deb.size) : null };
    }
    return { badge: null, alt: null };
  })();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmKeys.forEach((key) => {
      const value = params.get(key);
      if (value) {
        sessionStorage.setItem(key, value);
      }
    });
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Smartloop',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Linux, Windows',
    description: 'A local AI assistant that runs on the machine you already own. Curated open models chosen and tuned for you — nothing to pick, nothing to configure. Read documents and scans, connect MCP tools, and create skills while your models and data stay on-device.',
    url: 'https://smartloop.ai',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Organization', name: 'Smartloop Inc.', url: 'https://smartloop.ai' },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const active = WORK[work];

  return (
    <div id="app" className="body">
      <Head>
        <title>Smartloop | Frontier quality. Local first.</title>
        <meta name="description" content="A local AI assistant that runs on the machine you already own. Curated open models chosen and tuned for you — nothing to pick, nothing to configure. Read documents and scans, connect MCP tools, and create skills while your models and data stay on-device." />
        <meta property="og:title" content="Smartloop | Frontier quality. Local first." />
        <meta property="og:description" content="A local AI assistant that runs on the machine you already own. Curated open models chosen and tuned for you — nothing to pick, nothing to configure. Read documents and scans, connect MCP tools, and create skills while your models and data stay on-device." />
        <link rel="canonical" href="https://smartloop.ai/" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Head>
      <div className="wrapper">
        <Header />
        <main className={styles.page}>
          {/* ── Hero ───────────────────────────────────────── */}
          <section id="studio" className={styles.hero}>
            <div className={styles.heroGlow} aria-hidden="true" />
            {/* Model and hardware names drift past either side of the
                headline; wide screens only. */}
            <div className={`${styles.heroDrift} ${styles.heroDriftLeft}`} aria-hidden="true">
              <Marquee items={MODELS} />
              <Marquee items={HARDWARE} reverse slow />
              <Marquee items={[...MODELS].reverse()} />
            </div>
            <div className={`${styles.heroDrift} ${styles.heroDriftRight}`} aria-hidden="true">
              <Marquee items={HARDWARE} reverse />
              <Marquee items={MODELS} slow />
              <Marquee items={[...HARDWARE].reverse()} reverse />
            </div>

            <div className={styles.heroInner}>
              <p className={styles.eyebrow}>
                {/* Version is baked in at build time, so it renders on first
                    paint with no fetch and no layout shift. */}
                {release ? <>studio v{release.version} · runs on your device</> : <>runs on your device</>}
              </p>
              <h1 className={styles.heroTitle}>
                Frontier quality. <span className={styles.accent}>Local first.</span>
              </h1>
              <p className={styles.heroLede}>
                A fast System 1 model plans every request and routes each step to the open model built for it — documents, tools, web search and an API, all on the hardware you already own. Your data never leaves the device.
              </p>
              <div className={styles.heroCta}>
                <div className={styles.heroCtaRow}>
                  {heroCta.badge}
                  <Link to="/download" className={styles.btnSecondary}>all downloads</Link>
                  <Link to="/contact/" className={styles.btnGhost}>talk to us</Link>
                </div>
                {heroCta.alt}
                <p className={styles.heroMeta}>free · on-device · no account</p>
              </div>
            </div>
          </section>

          {/* ── Product stage: Studio, with the run behind it ── */}
          <section className={styles.shell}>
            <div className={styles.stage}>
              {/* The recording carries its own window and desktop, so it
                  gets no frame of ours on top. */}
              <div className={styles.stageWindow}>
                <video
                  src="/img/studio-demo.mp4"
                  className={styles.stageVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>

              {/* One ask, split across the models that answer it. */}
              <div className={styles.stageRun} aria-hidden="true">
                <div className={styles.runHead}>
                  <span>sl-mini · orchestrator</span>
                  <span className={styles.runLive}><b /> live</span>
                </div>
                {/* The same run the recording beside it shows. */}
                <p className={styles.runPrompt}><span>›</span>/contract-review</p>
                <ul className={styles.runSteps}>
                  <li><Icon name="check" /><span>plan</span><em>qwen3.5-2b</em></li>
                  <li><Icon name="check" /><span>read 5 contracts</span><em>ministral3-3b</em></li>
                  <li><Icon name="check" /><span>compose</span><em>qwen3.5-2b</em></li>
                </ul>
                <p className={styles.runFoot}><b /> M4 Mac · 24 GB · 0 bytes uploaded</p>
              </div>
            </div>
            <p className={styles.stageCaption}>
              Smartloop Studio for macOS · Linux · Windows
            </p>
          </section>

          {/* ── Engine ─────────────────────────────────────── */}
          <section className={styles.shell}>
            <div className={styles.engine}>
              <div className={styles.engineText}>
                <p className={styles.kicker}>The orchestrator</p>
                <h2 className={styles.h2}>You shouldn&rsquo;t have to pick a model.</h2>
                <p className={styles.sub}>
                  Running AI locally usually means choosing between hundreds of models, guessing at quantization and hoping it fits in your RAM. Smartloop makes those calls for you: on first launch it checks the memory and GPU you have, then fits the models to them — integrated graphics included.
                </p>
                <div className={styles.stats}>
                  <div><strong>0</strong><span>models to choose</span></div>
                  <div><strong>16<small> GB</small></strong><span>memory to start</span></div>
                  <div><strong>0</strong><span>bytes of your data uploaded</span></div>
                </div>
              </div>
              <div className={styles.engineChips} aria-hidden="true">
                <p className={styles.ruleLabel}>Open models</p>
                <Marquee items={MODELS} />
                <Marquee items={[...MODELS].reverse()} reverse slow />
                <p className={styles.ruleLabel}>Your hardware</p>
                <Marquee items={HARDWARE} slow />
                <Marquee items={[...HARDWARE].reverse()} reverse />
              </div>
            </div>
          </section>

          {/* ── What you do with it ────────────────────────── */}
          <section className={styles.shell}>
            <div className={styles.work}>
              <div>
                <p className={styles.kicker}>What you do with it</p>
                <h2 className={styles.h2}>Real work, not just chat.</h2>
                <div className={styles.workTabs} role="tablist" aria-label="Features">
                  {WORK.map((w, i) => (
                    i === work ? (
                      <div key={w.key} className={styles.workCard} role="tab" aria-selected="true">
                        <p className={styles.workCardTitle}><Icon name={w.icon} /> {w.title}</p>
                        <p className={styles.workCardDesc}>{w.desc}</p>
                        <Link to={w.to} className={styles.textLink}>read the guide</Link>
                      </div>
                    ) : (
                      <button
                        key={w.key}
                        type="button"
                        role="tab"
                        aria-selected="false"
                        className={styles.workPill}
                        onClick={() => setWork(i)}
                      >
                        <Icon name={w.icon} /> {w.title}
                      </button>
                    )
                  ))}
                </div>
              </div>

              <div className={styles.workStage} aria-hidden="true">
                <div key={active.key} className={styles.workWindow}>
                  <div className={styles.windowBar}>
                    <i /><i /><i />
                    <span className={styles.windowTitle}>{active.window}</span>
                    <span className={styles.pillLocal}><b /> {active.badge}</span>
                  </div>
                  <ul className={styles.workRows}>
                    {active.rows.map((r) => (
                      <li key={r.label}>
                        <span className={styles.workRowIcon}><Icon name={r.icon} /></span>
                        <span className={styles.workRowLabel}>{r.label}</span>
                        <span className={styles.workRowMeta}>{r.meta}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── Template: legal ────────────────────────────── */}
          <section id="use-cases" className={styles.shell}>
            <div className={styles.section}>
              <p className={styles.kicker}>On-device privacy</p>
              <h2 className={styles.h2}>An associate that never leaves the office.</h2>
              <p className={styles.sub}>
                Some documents can&rsquo;t go to a cloud model. Smartloop reads and reasons over them on your own machine, so privileged material never leaves the device — and every answer cites the clause it came from.
              </p>

              <div className={styles.caseCard}>
                <div className={styles.caseText}>
                  <p className={styles.caseLead}>
                    The template is a fictional firm&rsquo;s client file: five agreements and two review skills, ready to import into Studio.
                  </p>
                  <ul className={styles.casePoints}>
                    {legal.points.map(([lead, rest]) => (
                      <li key={lead}><b>{lead}</b> {rest}</li>
                    ))}
                  </ul>
                  <div className={styles.caseActions}>
                    {/* The template is the lead: download it, then the guide
                        walks through what to ask it. */}
                    <a className={styles.btnPrimary} href={legal.starter.href} download>
                      <Icon name="download" /> download template
                      <span className={styles.btnMeta}>{legal.starter.size}</span>
                    </a>
                    <Link to="/docs/templates/legal" className={styles.btnSecondary}>
                      read the guide <Icon name="arrow" />
                    </Link>
                    <Link to="/contact/" className={styles.btnGhost}>contact us</Link>
                  </div>
                </div>

                <div className={styles.caseArt} aria-hidden="true">
                  <div className={styles.caseWindow}>
                    <div className={styles.windowBar}>
                      <i /><i /><i />
                      <span className={styles.windowTitle}>{legal.run.project}</span>
                      <span className={styles.pillLocal}><b /> on-device</span>
                    </div>
                    <div className={styles.caseBody}>
                      <p className={styles.caseAsk}>{legal.run.prompt}</p>
                      <div className={styles.caseGrid}>
                        <span className={styles.caseHead}>clause</span>
                        <span className={styles.caseHead}>current</span>
                        <span className={styles.caseHead}>2026 draft</span>
                        {legal.run.rows.map(([clause, now, next, flag]) => (
                          <div key={clause} className={styles.caseRow}>
                            <span>{clause}</span>
                            <span>{now}</span>
                            <span className={flag ? styles.caseFlag : undefined}>{next}</span>
                          </div>
                        ))}
                      </div>
                      <div className={styles.caseRefs}>
                        {legal.run.refs.map((r) => (
                          <span key={r}><Icon name="file" /> {r}</span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.caseModels}>
                      {legal.models.map(([role, model]) => (
                        <span key={role}>{role} <b>{model}</b></span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Docent ─────────────────────────────────────── */}
          <section id="docent" className={styles.shell}>
            <div className={styles.docent}>
              <div className={styles.docentText}>
                <p className={styles.kicker}>
                  In your terminal
                  {docentVersion && <span className={styles.tag}>v{docentVersion}</span>}
                </p>
                <h2 className={styles.h2}>Same agent. No window.</h2>
                <p className={styles.sub}>
                  Install <code>docent</code> to chat with your documents, search the web and connect MCP servers — in your scripts or over SSH, with the same models and projects as Studio.
                </p>
                <ul className={styles.docentPoints}>
                  <li><Icon name="check" /><span><b>One command.</b> Sets itself up on first run.</span></li>
                  <li><Icon name="check" /><span><b>Your files.</b> Drop a PDF on the terminal and ask.</span></li>
                  <li><Icon name="check" /><span><b>Scriptable.</b> Pipe answers with <code>--plain</code>.</span></li>
                </ul>
                <DocentInstall />
                <p className={styles.ctaAlt}>
                  also runs as smartloop, its old name ·{' '}
                  <Link to="/docs/command-line-tool" className={styles.textLink}>full reference</Link>
                </p>
              </div>
              <div className={styles.docentTerm}>
                <div className={styles.windowBar}>
                  <i /><i /><i />
                  <span className={styles.windowTitle}>docent</span>
                  <span className={styles.pillLocal}><b /> local</span>
                </div>
                {/* One recording per site theme; CSS hides the other. */}
                {(['light', 'dark'] as const).map((theme) => (
                  <video
                    key={theme}
                    className={`${styles.docentVideo} ${theme === 'light' ? styles.docentLight : styles.docentDark}`}
                    src={theme === 'light' ? require('../../docs/cli-run-latte.mp4').default : require('../../docs/cli-run-mocha.mp4').default}
                    aria-label="docent in a terminal: the welcome card, the command list including /mcp, a question about mutual NDA clauses, and the answer with its web references"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── How it works ───────────────────────────────── */}
          <section className={styles.shell}>
            <div className={styles.section}>
              <h2 className={styles.h2}>How it works</h2>
              <p className={styles.sub}>Four steps, none of them a setting.</p>
              <ol className={styles.steps}>
                {steps.map(([title, desc], i) => (
                  <li key={title}>
                    <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                    <p className={styles.stepTitle}>{title}</p>
                    <p className={styles.stepDesc}>{desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ── Docs ───────────────────────────────────────── */}
          <section className={styles.shell}>
            <div className={styles.section}>
              <p className={styles.kicker}>Documentation</p>
              <h2 className={styles.h2}>Guides to get you running.</h2>
              <div className={styles.docsGrid}>
                {docs.map((doc) => (
                  <Link key={doc.to} to={doc.to} className={styles.docCard}>
                    <p className={styles.docTitle}>{doc.title}</p>
                    <p className={styles.docDesc}>{doc.desc}</p>
                    <span className={styles.docArrow}><Icon name="arrow" /></span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ────────────────────────────────────────── */}
          <section className={styles.shell}>
            <div className={`${styles.section} ${styles.faqWrap}`}>
              <div>
                <p className={styles.kicker}>FAQ</p>
                <h2 className={styles.h2}>Questions, answered.</h2>
              </div>
              <div className={styles.faqList}>
                {faqs.map((item) => (
                  <details key={item.q} className={styles.faqItem}>
                    <summary className={styles.faqQ}>{item.q}</summary>
                    <p className={styles.faqA}>
                      {item.a.split('support@smartloop.ai').flatMap((part, idx) =>
                        idx === 0
                          ? [part]
                          : [
                            <a key={idx} className={styles.textLink} href="mailto:support@smartloop.ai">
                              support@smartloop.ai
                            </a>,
                            part,
                          ]
                      )}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ── Closing CTA + partners ─────────────────────── */}
          <section className={styles.shell}>
            <div className={styles.closing}>
              <div className={styles.heroGlow} aria-hidden="true" />
              <p className={styles.eyebrow}>free to start</p>
              <h2 className={styles.closingTitle}>Start asking. <span className={styles.accent}>Locally.</span></h2>
              <p className={styles.sub}>Install Studio, drop in a document and ask. Nothing to pick, nothing to configure.</p>
              <div className={styles.closingCta}>
                <Link to="/download" className={styles.btnPrimary}>download studio</Link>
                <Link to="/docs/getting-started" className={styles.btnGhost}>getting started</Link>
              </div>
            </div>
            <div className={styles.partners}>
              <p className={styles.partnersLabel}>Accelerated by</p>
              <div className={styles.partnerRow}>
                {/* In brand colour, drawn to one height rather than one
                    width so the three marks carry the same visual weight.
                    Each wordmark is dark or grey, so dark mode swaps in a
                    light-wordmark version, as the brands' own guides do. */}
                <span className={styles.partnerTile}>
                  <img src="img/logos/nvidia-color.png" className={styles.logoLight} alt="NVIDIA" />
                  <img src="img/logos/nvidia-color-dark.png" className={styles.logoDark} alt="NVIDIA" />
                </span>
                <span className={styles.partnerTile}>
                  <img src="img/logos/microsoft-logo.svg" className={styles.logoLight} alt="Microsoft" />
                  <img src="img/logos/microsoft-logo-dark.svg" className={styles.logoDark} alt="Microsoft" />
                </span>
                <span className={styles.partnerTile}>
                  <img src="img/logos/Google_for_Startups_logo.svg.png" className={styles.logoLight} alt="Google for Startups" />
                  <img src="img/logos/google-for-startups-dark.png" className={styles.logoDark} alt="Google for Startups" />
                </span>
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
