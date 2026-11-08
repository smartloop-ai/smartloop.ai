import { type ReactNode, useEffect, useState } from 'react';
import Head from '@docusaurus/Head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useLatestRelease, {
  findArtifact,
  formatSize,
  type ArtifactKind,
  type ArtifactPlatform,
  type Release,
} from '../hooks/useLatestRelease';
import {
  DirectDownloadBlock,
} from '../components/StoreBadge';
import styles from './index.module.css';

function MacIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function LinuxIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 128 128" fill="currentColor" aria-label="Linux">
      <g transform="translate(0,128) scale(0.1,-0.1)">
        <path d="M577 1266 c-21 -8 -47 -22 -59 -33 -43 -38 -48 -64 -48 -231 l0 -158 -41 -55 c-22 -30 -51 -72 -64 -94 -32 -55 -95 -227 -95 -260 0 -43 -52 -100 -106 -115 -50 -14 -66 -37 -55 -80 4 -14 4 -38 0 -55 -19 -84 -10 -95 99 -115 33 -6 93 -22 133 -35 92 -32 120 -31 159 2 31 26 37 27 160 27 l127 1 37 -32 c48 -43 82 -43 140 2 25 19 72 49 103 67 32 17 70 40 86 50 38 27 36 61 -5 89 -39 27 -48 38 -48 61 0 9 -5 29 -12 45 -6 15 -12 66 -12 113 -1 100 -12 124 -133 306 l-75 113 -14 126 c-15 147 -38 204 -97 243 -46 31 -125 39 -180 18z m157 -178 c18 -26 21 -71 6 -99 -17 -31 -28 -22 -23 20 4 30 2 39 -12 45 -22 8 -45 -10 -45 -36 0 -32 -25 -15 -28 20 -6 61 69 97 102 50z m-170 -10 c18 -25 21 -64 7 -73 -5 -3 -12 3 -16 14 -3 11 -12 25 -20 31 -23 19 -38 -28 -19 -57 8 -13 10 -24 4 -28 -13 -8 -30 28 -30 65 0 66 43 93 74 48z m106 -117 c25 -10 45 -24 45 -31 0 -7 -27 -28 -60 -46 l-61 -33 -32 19 c-49 30 -51 49 -12 82 40 32 58 34 120 9z m104 -120 c84 -165 129 -317 119 -402 -5 -43 -9 -48 -32 -51 -25 -3 -26 -6 -29 -73 -3 -79 -16 -99 -91 -143 -36 -21 -61 -27 -130 -30 l-86 -4 -23 31 c-21 28 -21 33 -7 47 8 8 15 21 15 27 0 7 -34 44 -77 84 l-78 71 0 64 c1 66 12 97 96 275 22 46 42 96 46 113 6 31 6 31 27 12 49 -45 62 -46 129 -8 34 19 70 35 79 35 11 1 27 -17 42 -48z m-458 -479 c23 -14 164 -234 164 -254 0 -30 -29 -58 -59 -58 -14 0 -57 11 -96 25 -38 13 -96 29 -129 36 l-58 11 6 45 c3 25 6 61 6 79 0 30 4 34 48 48 33 11 53 26 65 46 18 30 32 36 53 22z m579 -42 c9 -42 38 -55 87 -41 21 7 44 21 51 31 17 29 23 25 36 -25 8 -34 19 -48 41 -60 17 -9 30 -21 30 -28 0 -6 -26 -25 -57 -42 -31 -16 -78 -46 -103 -66 -57 -45 -81 -53 -105 -35 -21 15 -22 26 -10 194 8 103 18 127 30 72z" />
      </g>
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
    </svg>
  );
}

type StudioCard = {
  key: 'macos' | 'linux' | 'windows';
  title: string;
  meta: string;
  icon: ReactNode;
  minimum: string[];
  recommended: string[];
  // Every card offers our own installer and nothing else — no store links: it
  // ships the moment a release is published rather than when store review
  // clears, and on the Mac it is not sandboxed, so Studio shares ~/.smartloop
  // with the Docent CLI.
  // Installer kinds only — the macOS zip and Linux AppImage are auto-update
  // payloads and must never be offered as a download link.
  platform: ArtifactPlatform;
  kind: ArtifactKind;
  // One download per architecture where the platform ships more than one.
  arches?: ('x64' | 'arm64')[];
};

const studioCards: StudioCard[] = [
  {
    key: 'macos',
    title: 'Mac',
    meta: 'Apple Silicon · macOS 12+',
    icon: <MacIcon />,
    minimum: [
      'Apple Silicon (M3 or newer)',
      'macOS 12 Monterey or later',
      '16 GB unified memory',
      '10 GB free disk space',
    ],
    recommended: ['More unified memory is better — 24 GB or above'],
    platform: 'darwin',
    kind: 'dmg',
  },
  {
    key: 'windows',
    title: 'Windows',
    meta: 'Windows 11 · x86_64',
    icon: <WindowsIcon />,
    minimum: [
      'Windows 11 (x86_64)',
      'Vulkan-capable GPU — NVIDIA, AMD, or Intel, including integrated graphics',
      '16 GB system RAM',
      '10 GB free disk space',
    ],
    recommended: ['More system RAM is better — 24 GB or above', 'A discrete NVIDIA GPU (RTX 40-series or newer, 8 GB+ VRAM)'],
    platform: 'win32',
    kind: 'nsis',
  },
  {
    key: 'linux',
    title: 'Linux',
    meta: 'Linux · x86_64 · ARM64',
    icon: <LinuxIcon />,
    minimum: [
      'Linux x86_64 or ARM64 — Debian, Ubuntu, or a derivative',
      'Vulkan-capable GPU — NVIDIA, AMD, or Intel, including integrated graphics',
      '16 GB system RAM',
      '10 GB free disk space',
    ],
    recommended: ['More system RAM is better — 24 GB or above', 'A discrete NVIDIA GPU (RTX 40-series or newer, 8 GB+ VRAM)'],
    platform: 'linux',
    kind: 'deb',
    arches: ['x64', 'arm64'],
  },
];

type Arch = 'x64' | 'arm64';

const ARCH_NAME: Record<Arch, string> = { x64: 'x86_64', arm64: 'ARM64' };

/**
 * The machine's architecture, where the browser says. Chromium reports it
 * through User-Agent Client Hints; other browsers sometimes name it in the
 * user agent (aarch64 / arm64 on Linux). Null off Linux, or when there is no
 * telling, and the switch stays on x86_64.
 */
async function detectArch(): Promise<Arch | null> {
  const nav = navigator as Navigator & {
    userAgentData?: {
      platform?: string;
      getHighEntropyValues(hints: string[]): Promise<{ architecture?: string }>;
    };
  };
  // Only a Linux machine's own architecture says which Linux build it wants;
  // on a Mac or PC the download is for some other box, so leave the default.
  const platform = nav.userAgentData?.platform ?? navigator.userAgent;
  if (!/linux/i.test(platform) || /android/i.test(navigator.userAgent)) return null;
  try {
    const hints = await nav.userAgentData?.getHighEntropyValues(['architecture']);
    if (hints?.architecture === 'arm') return 'arm64';
    if (hints?.architecture === 'x86') return 'x64';
  } catch {
    // Hints refused; fall back to the user agent.
  }
  if (/aarch64|arm64|armv8/i.test(navigator.userAgent)) return 'arm64';
  if (/x86_64|amd64|x64/i.test(navigator.userAgent)) return 'x64';
  return null;
}

/**
 * The build a multi-architecture card offers. It starts on the visitor's own
 * architecture when the browser reports it, so most people never touch the
 * switch.
 */
function useArch(arches: Arch[] | undefined): [Arch | undefined, (a: Arch) => void] {
  const [arch, setArch] = useState<Arch | undefined>(arches?.[0]);

  useEffect(() => {
    if (!arches) return;
    let live = true;
    detectArch().then((found) => {
      if (live && found && arches.includes(found)) setArch(found);
    });
    return () => {
      live = false;
    };
  }, []);

  return [arch, setArch];
}

/**
 * A platform's card. Where the platform ships more than one architecture, the
 * switch takes the place of the line under its name, and the one button at
 * the foot downloads whichever build is picked.
 */
function DownloadCard({ card, release }: { card: StudioCard; release: Release | null }): ReactNode {
  const [arch, setArch] = useArch(card.arches);
  const artifact = findArtifact(release, card.platform, card.kind, arch);

  return (
    // The download link carries its own click, so the card itself is a plain
    // container rather than one big link, and does not light up on hover.
    <div className={styles.downloadCard}>
      <div className={styles.downloadCardHeader}>
        <div className={styles.downloadCardIcon}>{card.icon}</div>
        <div className={styles.downloadCardHeaderText}>
          <p className={styles.downloadCardTitle}>{card.title}</p>
          {card.arches && arch ? (
            <div className={`${styles.downloadOsTabs} ${styles.archSwitch}`} role="radiogroup" aria-label="Architecture">
              {card.arches.map((a) => (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={a === arch}
                  className={`${styles.downloadOsTab} ${a === arch ? styles.downloadOsTabActive : ''}`}
                  onClick={() => setArch(a)}
                >
                  {ARCH_NAME[a]}
                </button>
              ))}
            </div>
          ) : (
            <p className={styles.downloadCardMeta}>{card.meta}</p>
          )}
        </div>
      </div>
      <p className={styles.downloadReqLabel}>Minimum</p>
      <ul className={styles.downloadReqList}>
        {card.minimum.map((req, i) => (
          <li key={i}>{req}</li>
        ))}
      </ul>
      <p className={styles.downloadRecLabel}>Recommended</p>
      <ul className={styles.downloadRecList}>
        {card.recommended.map((req, i) => (
          <li key={i}>{req}</li>
        ))}
      </ul>
      <div className={styles.downloadCardFoot}>
        {/* The block links to the API's tracked redirect, which resolves the
            latest build itself; the release fetch only adds the size. Every
            card gets the same plain button, so the visitor's own platform is
            not singled out. */}
        <DirectDownloadBlock
          platform={card.key}
          arch={arch}
          size={artifact ? formatSize(artifact.size) : undefined}
          variant="secondary"
        />
      </div>
    </div>
  );
}

export default function Download(): ReactNode {
  const { status, release } = useLatestRelease();

  return (
    <div id="app" className="body">
      <Head>
        <title>Downloads | Smartloop</title>
        <meta name="description" content="Download Smartloop Studio for Mac (.dmg), Windows (.exe), or Linux (.deb). See system requirements for macOS, Windows, and Linux." />
        <meta property="og:title" content="Downloads | Smartloop" />
        <meta property="og:description" content="Download Smartloop Studio for Mac (.dmg), Windows (.exe), or Linux (.deb). See system requirements for macOS, Windows, and Linux." />
        <link rel="canonical" href="https://smartloop.ai/download/" />
      </Head>
      <div className="wrapper">
        <Header />
        <main className={styles.page}>
          <section className="flex flex-col items-center text-center px-6 pt-28 md:pt-36 pb-2 max-w-5xl mx-auto w-full">
            <span className={styles.comingSoonBadge}>Downloads</span>
            <h1 className={`text-3xl md:text-5xl mt-4 mb-3 leading-tight ${styles.heroTitle}`}>
              Smartloop <span className={styles.studioAccent}>Studio</span>
            </h1>
            {/* The version and platform line every download page carries, right
                under the title. The download always serves the current build, so a
                release the API did not return just drops the version. */}
            <p className={styles.downloadMeta}>
              {status === 'ready' ? `v${release.version} · ` : ''}macOS · Windows · Linux
            </p>
            <p className="text-zinc-300 max-w-xl mb-2">
              Pick the build that matches your machine. No account needed — every download runs entirely on your device, and no data leaves your hardware.
            </p>
          </section>

          {/* Studio downloads */}
          <section className="px-6 pt-4 pb-10 max-w-5xl mx-auto w-full">
            <div className={styles.downloadGrid}>
              {studioCards.map((card) => (
                <DownloadCard key={card.key} card={card} release={release} />
              ))}
            </div>
          </section>

          <p className="text-zinc-500 text-center px-6 pt-4 pb-16 text-sm max-w-2xl mx-auto">
            More memory means more room for the orchestrator to fit the right model for
            the task — larger models stay resident instead of being swapped out.
          </p>

          <Footer />
        </main>
      </div>
    </div>
  );
}
