import { useEffect, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DocentInstall, { installCommands, useInstallShell } from '../components/DocentInstall';
import styles from './home.module.css';
import local from './docent.module.css';

// smartloop.ai/docent: the page to link from posts and launches, so docent
// traffic shows up as its own page in analytics (with any utm_* tags on the
// link) instead of blending into the homepage.

const DESCRIPTION =
  'docent is an open-source AI coding agent for your terminal that runs on open models. It writes code as diffs, checks it against your language servers and build, fixes its own errors, and runs the commands once you say so.';

const points: [string, string][] = [
  ['Writes code.', 'New files whole, changes as small edits, each shown as a diff as it streams.'],
  ['Checks its work.', 'Runs your language servers and build, and hands errors back to the model until it passes.'],
  ['Runs the work.', 'Commits, installs and tests, once you say so.'],
  ['Open models.', 'No vendor lock-in: pick the model, and run it locally so your code stays private.'],
];

// What you type at each step, then what docent does with it.
const steps: { title: string; code: string; desc: string }[] = [
  {
    title: 'Install',
    code: installCommands.unix, // swapped for the visitor's shell below
    desc: 'One line puts docent on your PATH. macOS, Linux and Windows.',
  },
  {
    title: 'Open a project',
    code: 'cd my-app && docent',
    desc: 'The first run fetches what it needs. Type /models to pick an open model, like MiniMax M3.',
  },
  {
    title: 'Ask for a change',
    code: '> add a CLI that asks for a name and greets it',
    desc: 'docent writes the diff, builds it, fixes what breaks, and asks before it runs anything.',
  },
];

// ── Long-form content: the detail people (and search engines) look for.
// Every claim here comes from the docent README and the coding docs.

// What happens on each prompt, in order.
const loop: [string, string][] = [
  ['It reads the project.', 'The file tree, the files your prompt is about and the git state (branch, remotes, what changed), plus your OS, shell, package managers and toolchains, so it answers from your code and uses brew on a Mac and apt-get on Ubuntu.'],
  ['You see diffs as they stream.', 'Each file shows as numbered hunks, additions in green and removals in red, and is written into the folder as soon as it is done. Changes to files that already exist ask first.'],
  ['It checks the build and fixes it.', 'A fast check for the kind of project runs after every change. Errors go back to the model, round after round, until the check passes.'],
  ['Commands wait for your OK.', 'Commits, installs and test runs come back as shell commands. Enter runs them, Tab approves the rest of the session, Esc skips. Their output goes back to the agent, so a failing test gets fixed next.'],
  ['Long runs go to the background.', 'Dev servers and watchers keep running under the prompt while you keep chatting. /tasks shows them and /stop ends them.'],
];

// Language → the language server and the build check docent uses.
const stack: [string, string, string][] = [
  ['Rust', 'rust-analyzer', 'cargo check'],
  ['Go', 'gopls', 'go build'],
  ['TypeScript · JavaScript', 'typescript-language-server', 'tsc --noEmit'],
  ['Python', 'pyright', 'py_compile'],
  ['C · C++', 'clangd', 'your build'],
  ['Shell scripts', '—', 'bash -n'],
];

const beyond: [string, string][] = [
  ['Chat with your files', 'Drop a PDF, Office file, CSV, text file or image on the terminal and ask about it. Documents are indexed on your machine.'],
  ['Web search', 'Sign in with /login for AI search, so answers can cite current docs and library APIs, with their sources.'],
  ['MCP servers', 'Connect tools with /mcp add <url> and docent can call them while it works.'],
  ['Scriptable', 'Pipe a plain answer into your scripts with --plain, or run docent over SSH.'],
];

const faqs: { q: string; a: string }[] = [
  {
    q: 'What is docent?',
    a: 'docent is an open-source AI coding agent for the terminal, made by Smartloop. Open it in a project, ask for a change, and it writes the code as diffs, checks it with your language servers and build, fixes its own errors, and runs commands like commits and tests once you approve them. It also answers questions about your documents and the web.',
  },
  {
    q: 'Is docent free and open source?',
    a: 'Yes. docent is MIT licensed, with the source on GitHub, and it is free to use with no account. Signing in is optional: it unlocks AI web search and the cloud models, which draw on a monthly allowance.',
  },
  {
    q: 'Which models does docent use?',
    a: 'Open models. Small ones such as Qwen, Gemma and Ministral run on your own machine, and larger open models such as MiniMax M3, GLM and the bigger Qwen models are available in the cloud when you sign in. Pick and switch models with /models; the one that suits your machine is marked.',
  },
  {
    q: 'Does my code leave my machine?',
    a: 'Not with local models: docent runs the model and its agent on your computer, with GPU acceleration through Metal on macOS and Vulkan on Linux and Windows. Cloud models are marked in /models, and web search sends only the search query, never your files.',
  },
  {
    q: 'Which languages does docent support?',
    a: 'Any language it can read, with built-in checks for Rust (cargo check), Go (go build), TypeScript and JavaScript (tsc --noEmit), Python (py_compile) and shell scripts (bash -n). It also uses your language servers, such as rust-analyzer, gopls, typescript-language-server, pyright and clangd, to catch errors.',
  },
  {
    q: 'Which platforms does it run on?',
    a: 'macOS on Apple Silicon (signed and notarized), Linux on x86_64 and arm64, and Windows on x86_64 (signed). Install with one command: curl -fsSL https://smartloop.ai/install | sh on macOS and Linux, or irm https://smartloop.ai/install.ps1 | iex in PowerShell.',
  },
  {
    q: 'Will it run commands without asking?',
    a: 'No. Files it creates are written straight away, but changes to existing files ask first, and every shell command (a commit, an install, a test run) waits for you to press Enter. Press Tab to approve the rest of a session, or Esc to skip.',
  },
];

function GitHubIcon(): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function Check(): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Docent(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const shell = useInstallShell();
  // Latest Docent CLI version, baked in at build time (docusaurus.config.ts).
  const docentVersion = siteConfig.customFields?.docentVersion as string | null | undefined;

  // Keep campaign tags for the session, as the homepage does.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
      const value = params.get(key);
      if (value) sessionStorage.setItem(key, value);
    });
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'docent',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Linux, Windows',
    description: DESCRIPTION,
    url: 'https://smartloop.ai/docent',
    license: 'https://opensource.org/licenses/MIT',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Organization', name: 'Smartloop Inc.', url: 'https://smartloop.ai' },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div id="app" className="body">
      <Head>
        <title>docent | Open-source AI coding agent for your terminal</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content="docent | Open-source AI coding agent for your terminal" />
        <meta property="og:description" content={DESCRIPTION} />
        <link rel="canonical" href="https://smartloop.ai/docent" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Head>
      <div className="wrapper">
        <Header />
        <main className={styles.page}>
          <section className={styles.hero}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <div className={styles.heroInner}>
              <p className={styles.eyebrow}>
                {docentVersion ? <>docent v{docentVersion} · open source · MIT</> : <>open source · MIT</>}
              </p>
              <h1 className={styles.heroTitle}>
                A coding agent for your terminal. <span className={styles.accent}>On open models.</span>
              </h1>
              <p className={styles.heroLede}>{DESCRIPTION}</p>
              <div className={styles.heroCta}>
                <DocentInstall location="docent_page" variant="hero" />
                <p className={styles.heroMeta}>free · macOS, Linux, Windows · no account</p>
                {/* Secondary on purpose: the install line is the call to action. */}
                <p className={styles.ctaAlt} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <Link
                    to="https://github.com/smartloop-ai/docent"
                    className={styles.textLink}
                    aria-label="docent on GitHub"
                    title="docent on GitHub"
                    style={{ display: 'inline-flex' }}
                  >
                    <GitHubIcon />
                  </Link>
                  <span aria-hidden="true">·</span>
                  <Link to="/docs/command-line-tool" className={styles.textLink}>full reference</Link>
                </p>
              </div>
            </div>
          </section>

          {/* ── Demo: install to a running Rust program, narrated ── */}
          <section className={styles.shell}>
            <div className={styles.stage}>
              {/* The recording carries its own window and desktop, so it
                  gets no frame of ours on top. It plays on request, muted by
                  default; the narration is there if you unmute. */}
              <div className={styles.stageWindow}>
                <video
                  src={require('../../docs/docent-rust-demo.mp4').default}
                  poster="/img/docent-rust-demo-poster.jpg"
                  className={styles.stageVideo}
                  style={{ aspectRatio: '4 / 3' }}
                  aria-label="Installing docent with one command, enabling MiniMax M3 with /models, and asking it to build a Rust hello world that reads input and uses match; it builds and runs it"
                  controls
                  muted
                  preload="metadata"
                  playsInline
                />
              </div>
              <p className={styles.stageCaption} style={{ marginTop: 20 }}>
                install → pick an open model → a Rust program that builds and runs · 1:33
              </p>
            </div>
          </section>

          <section className={styles.shell}>
            <div className={styles.section}>
              <p className={styles.kicker}>What it does</p>
              <h2 className={styles.h2}>Ask for a change. Get a build that passes.</h2>
              <ul className={styles.docentPoints}>
                {points.map(([title, desc]) => (
                  <li key={title}><Check /><span><b>{title}</b> {desc}</span></li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── Each prompt, step by step ─────────────────── */}
          <section className={styles.shell}>
            <div className={styles.section}>
              <p className={styles.kicker}>How it works</p>
              <h2 className={styles.h2}>What happens when you ask for a change.</h2>
              <ol className={local.loop}>
                {loop.map(([title, desc], i) => (
                  <li key={title}>
                    <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className={styles.stepTitle}>{title}</h3>
                    <p className={styles.stepDesc}>{desc}</p>
                  </li>
                ))}
              </ol>
              <p className={styles.ctaAlt} style={{ marginTop: 24 }}>
                More in the <Link to="/docs/coding" className={styles.textLink}>coding guide</Link>.
              </p>
            </div>
          </section>

          {/* ── Languages ─────────────────────────────────── */}
          <section className={styles.shell}>
            <div className={styles.section}>
              <p className={styles.kicker}>Works with your stack</p>
              <h2 className={styles.h2}>Checked by the tools you already use.</h2>
              <p className={styles.sub}>
                docent reads code in any language. For these it also knows the language server and the build check, so errors are caught and fixed before you see them.
              </p>
              <div className={local.table} role="table" aria-label="Languages, language servers and build checks">
                <div className={local.tableHead} role="row">
                  <span role="columnheader">Language</span>
                  <span role="columnheader">Language server</span>
                  <span role="columnheader">Build check</span>
                </div>
                {stack.map(([lang, lsp, check]) => (
                  <div key={lang} className={local.tableRow} role="row">
                    <span role="cell">{lang}</span>
                    <code role="cell">{lsp}</code>
                    <code role="cell">{check}</code>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Models and platforms ──────────────────────── */}
          <section className={styles.shell}>
            <div className={styles.section}>
              <p className={styles.kicker}>Open models</p>
              <h2 className={styles.h2}>Your model, your machine.</h2>
              <div className={local.cards}>
                <div className={local.card}>
                  <h3 className={styles.stepTitle}>Local, on your GPU</h3>
                  <p className={styles.stepDesc}>
                    Small open models such as Qwen, Gemma and Ministral run on your computer, through Metal on macOS and Vulkan on Linux and Windows. Your code stays on the machine.
                  </p>
                </div>
                <div className={local.card}>
                  <h3 className={styles.stepTitle}>Bigger open models, when you need them</h3>
                  <p className={styles.stepDesc}>
                    Sign in to add larger open models such as MiniMax M3, GLM and the bigger Qwen models. Switch any time with <code>/models</code>; no vendor lock-in.
                  </p>
                </div>
                <div className={local.card}>
                  <h3 className={styles.stepTitle}>macOS, Linux, Windows</h3>
                  <p className={styles.stepDesc}>
                    Signed builds for Apple Silicon Macs, Linux on x86_64 and arm64, and Windows on x86_64. One command installs it; no account needed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Beyond code ───────────────────────────────── */}
          <section className={styles.shell}>
            <div className={styles.section}>
              <p className={styles.kicker}>More than code</p>
              <h2 className={styles.h2}>An agent harness, not just an autocomplete.</h2>
              <ul className={styles.docentPoints}>
                {beyond.map(([title, desc]) => (
                  <li key={title}><Check /><span><b>{title}.</b> {desc}</span></li>
                ))}
              </ul>
              <p className={styles.ctaAlt} style={{ marginTop: 24 }}>
                Every command and shortcut is in the <Link to="/docs/command-line-tool" className={styles.textLink}>command-line reference</Link>; see also <Link to="/docs/documents" className={styles.textLink}>documents</Link> and <Link to="/docs/mcp-servers" className={styles.textLink}>MCP servers</Link>.
              </p>
            </div>
          </section>

          <section className={styles.shell}>
            <div className={styles.section}>
              <p className={styles.kicker}>Get started</p>
              <h2 className={styles.h2}>From install to a passing build.</h2>
              <p className={styles.sub}>Three things to type. docent does the rest.</p>
              <ol className={`${styles.steps} ${local.steps}`}>
                {steps.map(({ title, code, desc }, i) => (
                  <li key={title}>
                    <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                    <p className={styles.stepTitle}>{title}</p>
                    <code className={local.stepCode}>{i === 0 ? installCommands[shell] : code}</code>
                    <p className={styles.stepDesc}>{desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ── FAQ ───────────────────────────────────────── */}
          <section className={styles.shell}>
            <div className={`${styles.section} ${styles.faqWrap} ${local.lastSection}`}>
              <div>
                <p className={styles.kicker}>FAQ</p>
                <h2 className={styles.h2}>Questions, answered.</h2>
              </div>
              <div className={styles.faqList}>
                {faqs.map(({ q, a }) => (
                  <details key={q} className={styles.faqItem}>
                    <summary className={styles.faqQ}>{q}</summary>
                    <p className={styles.faqA}>{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
