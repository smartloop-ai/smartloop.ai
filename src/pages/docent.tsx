import { useEffect, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DocentInstall from '../components/DocentInstall';
import styles from './home.module.css';

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

const steps: [string, string][] = [
  ['Install', 'Run the one-liner above. It puts docent on your PATH.'],
  ['Open a project', 'cd into a repo and run docent. It downloads the models it needs the first time.'],
  ['Ask for a change', 'Describe what you want. docent writes it, builds it and fixes what breaks.'],
];

function Check(): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Docent(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
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
                <DocentInstall location="docent_page" />
                <div className={styles.heroCtaRow}>
                  <Link to="https://github.com/smartloop-ai/docent" className={styles.btnSecondary}>GitHub</Link>
                  <Link to="/docs/command-line-tool" className={styles.btnGhost}>full reference</Link>
                </div>
                <p className={styles.heroMeta}>free · macOS, Linux, Windows · no account</p>
              </div>
            </div>
          </section>

          <section className={styles.shell}>
            <div className={styles.docent}>
              <div className={styles.docentText}>
                <p className={styles.kicker}>What it does</p>
                <h2 className={styles.h2}>Ask for a change. Get a build that passes.</h2>
                <ul className={styles.docentPoints}>
                  {points.map(([title, desc]) => (
                    <li key={title}><Check /><span><b>{title}</b> {desc}</span></li>
                  ))}
                </ul>
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
                    aria-label="docent in a terminal: the welcome card, the command list, a question and the answer with its references"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ))}
              </div>
            </div>
          </section>

          <section className={styles.shell}>
            <div className={styles.section}>
              <h2 className={styles.h2}>Get started</h2>
              <p className={styles.sub}>Three steps, then you're coding.</p>
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
        </main>
        <Footer />
      </div>
    </div>
  );
}
