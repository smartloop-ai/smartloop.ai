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

  return (
    <div id="app" className="body">
      <Head>
        <title>docent | Open-source AI coding agent for your terminal</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content="docent | Open-source AI coding agent for your terminal" />
        <meta property="og:description" content={DESCRIPTION} />
        <link rel="canonical" href="https://smartloop.ai/docent" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
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
                  gets no frame of ours on top. It is narrated, so it plays
                  on request with sound rather than looping muted. */}
              <div className={styles.stageWindow}>
                <video
                  src={require('../../docs/docent-rust-demo.mp4').default}
                  poster="/img/docent-rust-demo-poster.jpg"
                  className={styles.stageVideo}
                  style={{ aspectRatio: '4 / 3' }}
                  aria-label="Installing docent with one command, enabling MiniMax M3 with /models, and asking it to build a Rust hello world that reads input and uses match; it builds and runs it"
                  controls
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

          <section className={styles.shell}>
            <div className={`${styles.section} ${local.lastSection}`}>
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

          <Footer />
        </main>
      </div>
    </div>
  );
}
