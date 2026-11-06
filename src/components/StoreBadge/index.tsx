import { type ReactNode } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useInstallerUrl, type ReleasePlatform } from '../../utils/api';
import styles from './styles.module.css';

// Each platform's store listing. Mac and Windows lead with our own installer
// and offer these underneath; Linux leads with the Snap Store.
export const MAC_APP_STORE_URL =
  'https://apps.apple.com/us/app/smartloop-studio/id6800891411?mt=12';

// The https listing works from any browser. The home-page CTA passes the
// ms-windows-store: deep link instead, to launch the Store app directly.
export const MS_STORE_URL = 'https://apps.microsoft.com/store/detail/XPDLN9NR8DDLLK';

export const SNAP_STORE_URL = 'https://snapcraft.io/smartloop-studio';

// The store listings are the one part of the funnel the site cannot measure on
// its own: once the visitor leaves for a store, our logs end. Both Apple and
// Microsoft read a campaign token off the listing URL and report it back in
// their own analytics, so every store link the site hands out carries one
// naming the page it came from. Apple's token is `ct` (App Store Connect
// reports it under Campaigns); Microsoft's is `cid`. Snapcraft has no
// equivalent, so its badge takes no campaign.
const CAMPAIGN_PARAM = { apple: 'ct', microsoft: 'cid', snap: null } as const;

/** Append a store's campaign token to a listing URL. */
function withCampaign(url: string, param: string | null, campaign?: string): string {
  if (!param || !campaign) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${param}=${encodeURIComponent(campaign)}`;
}

type StoreKey = 'apple' | 'microsoft' | 'snap';

/*
 * Each store's own badge artwork, served from static/img/badges exactly as the
 * vendor publishes it.
 *
 * All three require their badge be used as supplied, and Apple's rules are the
 * strictest of them, so this component is built to those and the other two
 * clear on the way past: the artwork is never recoloured, restretched, redrawn
 * in another typeface, or animated; it is at least 40px tall onscreen; and it
 * keeps clear space of a quarter of its own height on every side, which at the
 * height below is 11px. The layouts that place a badge own that last one — see
 * the gaps in index.module.css.
 *
 * This is why the badge is an <img> of the vendor's file rather than a lockup
 * rebuilt in our own type on our own square plate. A redrawn badge is the one
 * thing worse than no badge: it is what the visitor is scanning for, and a near
 * miss reads as a fake of it.
 *
 * Each store publishes the badge twice, for a light ground and a dark one. The
 * pair is swapped by theme rather than the artwork being tinted — a tint is
 * exactly what the guidelines forbid, and it is why the vendors ship two.
 */
type StoreArt = {
  // `light` is the badge for a light page ground — the dark plate — and `dark`
  // its inverse. Named for the theme they belong to, not for the plate colour.
  light: string;
  dark: string;
  // The badge's own words. It is an image of type, so this is what carries it
  // to a screen reader, and it is also the link's accessible name.
  alt: string;
  // The artwork's native size, which fixes the aspect ratio the badge is drawn
  // at. Apple's is 156.1 x 40, Microsoft's 161 x 44, Snapcraft's 182 x 56 —
  // all different, so a shared height is the only thing they can share without
  // one of them being stretched.
  width: number;
  height: number;
};

// Comfortably over Apple's 40px floor, and the one dimension every badge is
// drawn to. Widths follow from each badge's own ratio.
const BADGE_HEIGHT = 44;

const STORE_ART: Record<StoreKey, StoreArt> = {
  apple: {
    light: '/img/badges/mac-app-store-black.svg',
    dark: '/img/badges/mac-app-store-white.svg',
    alt: 'Download on the Mac App Store',
    width: 156.10054,
    height: 40,
  },
  microsoft: {
    light: '/img/badges/microsoft-store-black.svg',
    dark: '/img/badges/microsoft-store-white.svg',
    alt: 'Download from the Microsoft Store',
    width: 161,
    height: 44,
  },
  snap: {
    light: '/img/badges/snap-store-black.svg',
    dark: '/img/badges/snap-store-white.svg',
    alt: 'Get it from the Snap Store',
    width: 182,
    height: 56,
  },
};

type StoreBadgeProps = {
  href?: string;
  // Names the page this link was handed out from, for the store's own
  // analytics. See CAMPAIGN_PARAM above.
  campaign?: string;
};

function StoreBadgeLink({
  store,
  href,
  campaign,
}: { store: StoreKey } & Required<Pick<StoreBadgeProps, 'href'>> & StoreBadgeProps): ReactNode {
  const art = STORE_ART[store];
  // Scaled from the artwork's own ratio, so the badge is never distorted and
  // the box is reserved before the SVG arrives.
  const width = Math.round((art.width / art.height) * BADGE_HEIGHT);

  // The Windows CTA can be an ms-windows-store: deep link, which should hand
  // off to the Store app in place rather than open a tab.
  const external = /^https?:/i.test(href);

  // Both plates ship in the markup and CSS shows the one the theme calls for.
  // Not @theme/ThemedImage, which reads the colour mode through React context:
  // these pages render their own shell rather than Docusaurus's <Layout>, so
  // that context is not above them. The [data-theme] attribute is, and it is
  // what every other themed rule on this site keys off anyway.
  //
  // Only the shown badge is alt text; the hidden one is display:none, which
  // takes it out of the accessibility tree, so the link is named once.
  return (
    <a
      href={withCampaign(href, CAMPAIGN_PARAM[store], campaign)}
      className={styles.badge}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <img
        className={`${styles.badgeArt} ${styles.badgeArtDark}`}
        src={useBaseUrl(art.dark)}
        alt={art.alt}
        width={width}
        height={BADGE_HEIGHT}
      />
      <img
        className={`${styles.badgeArt} ${styles.badgeArtLight}`}
        src={useBaseUrl(art.light)}
        alt={art.alt}
        width={width}
        height={BADGE_HEIGHT}
      />
    </a>
  );
}

export function MacAppStoreBadge({ campaign, href = MAC_APP_STORE_URL }: StoreBadgeProps = {}): ReactNode {
  return <StoreBadgeLink store="apple" href={href} campaign={campaign} />;
}

export function MicrosoftStoreBadge({ campaign, href = MS_STORE_URL }: StoreBadgeProps = {}): ReactNode {
  return <StoreBadgeLink store="microsoft" href={href} campaign={campaign} />;
}

// Snapcraft reads no campaign token, so this badge takes none.
export function SnapStoreBadge({ href = SNAP_STORE_URL }: { href?: string } = {}): ReactNode {
  return <StoreBadgeLink store="snap" href={href} />;
}

/** The badge for a platform, for a card or a hero that resolves one at runtime. */
export function StoreBadgeFor({
  platform,
  campaign,
}: {
  platform: 'macos' | 'windows' | 'linux';
  campaign?: string;
}): ReactNode {
  if (platform === 'macos') return <MacAppStoreBadge campaign={campaign} />;
  if (platform === 'windows') return <MicrosoftStoreBadge campaign={campaign} />;
  return <SnapStoreBadge />;
}

// The platform marks our own download buttons carry — ours, not a store's, so
// they are drawn here rather than served as artwork.
type PlatformMark = 'apple' | 'microsoft' | 'linux';

// Tux is drawn on a 128-unit grid, the rest on 24. Each mark carries its own
// box so they can share one slot.
const MARK_VIEWBOX: Record<PlatformMark, string> = {
  apple: '0 0 24 24',
  microsoft: '0 0 24 24',
  linux: '0 0 128 128',
};

function Mark({ name }: { name: PlatformMark }): ReactNode {
  const props = { className: styles.mark, viewBox: MARK_VIEWBOX[name], 'aria-hidden': true as const };
  switch (name) {
    case 'linux':
      return (
        <svg {...props}>
          <g transform="translate(0,128) scale(0.1,-0.1)">
            <path d="M577 1266 c-21 -8 -47 -22 -59 -33 -43 -38 -48 -64 -48 -231 l0 -158 -41 -55 c-22 -30 -51 -72 -64 -94 -32 -55 -95 -227 -95 -260 0 -43 -52 -100 -106 -115 -50 -14 -66 -37 -55 -80 4 -14 4 -38 0 -55 -19 -84 -10 -95 99 -115 33 -6 93 -22 133 -35 92 -32 120 -31 159 2 31 26 37 27 160 27 l127 1 37 -32 c48 -43 82 -43 140 2 25 19 72 49 103 67 32 17 70 40 86 50 38 27 36 61 -5 89 -39 27 -48 38 -48 61 0 9 -5 29 -12 45 -6 15 -12 66 -12 113 -1 100 -12 124 -133 306 l-75 113 -14 126 c-15 147 -38 204 -97 243 -46 31 -125 39 -180 18z m157 -178 c18 -26 21 -71 6 -99 -17 -31 -28 -22 -23 20 4 30 2 39 -12 45 -22 8 -45 -10 -45 -36 0 -32 -25 -15 -28 20 -6 61 69 97 102 50z m-170 -10 c18 -25 21 -64 7 -73 -5 -3 -12 3 -16 14 -3 11 -12 25 -20 31 -23 19 -38 -28 -19 -57 8 -13 10 -24 4 -28 -13 -8 -30 28 -30 65 0 66 43 93 74 48z m106 -117 c25 -10 45 -24 45 -31 0 -7 -27 -28 -60 -46 l-61 -33 -32 19 c-49 30 -51 49 -12 82 40 32 58 34 120 9z m104 -120 c84 -165 129 -317 119 -402 -5 -43 -9 -48 -32 -51 -25 -3 -26 -6 -29 -73 -3 -79 -16 -99 -91 -143 -36 -21 -61 -27 -130 -30 l-86 -4 -23 31 c-21 28 -21 33 -7 47 8 8 15 21 15 27 0 7 -34 44 -77 84 l-78 71 0 64 c1 66 12 97 96 275 22 46 42 96 46 113 6 31 6 31 27 12 49 -45 62 -46 129 -8 34 19 70 35 79 35 11 1 27 -17 42 -48z m-458 -479 c23 -14 164 -234 164 -254 0 -30 -29 -58 -59 -58 -14 0 -57 11 -96 25 -38 13 -96 29 -129 36 l-58 11 6 45 c3 25 6 61 6 79 0 30 4 34 48 48 33 11 53 26 65 46 18 30 32 36 53 22z m579 -42 c9 -42 38 -55 87 -41 21 7 44 21 51 31 17 29 23 25 36 -25 8 -34 19 -48 41 -60 17 -9 30 -21 30 -28 0 -6 -26 -25 -57 -42 -31 -16 -78 -46 -103 -66 -57 -45 -81 -53 -105 -35 -21 15 -22 26 -10 194 8 103 18 127 30 72z" />
          </g>
        </svg>
      );
    case 'apple':
      return (
        <svg {...props}>
          <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 3.01-.85.98-2.24 1.74-3.37 1.65-.14-1.1.4-2.26 1.06-3 .76-.85 2.14-1.5 3.43-1.66zM20.5 17.1c-.55 1.27-.82 1.84-1.53 2.96-.99 1.56-2.39 3.5-4.12 3.51-1.54.02-1.93-1-4.02-.99-2.09.01-2.52 1.01-4.06.99-1.73-.02-3.05-1.77-4.04-3.33-2.77-4.36-3.06-9.47-1.35-12.19 1.21-1.93 3.13-3.06 4.93-3.06 1.84 0 2.99 1 4.5 1 1.47 0 2.37-1 4.5-1 1.61 0 3.32.88 4.54 2.4-3.99 2.19-3.34 7.88.65 9.71z" />
        </svg>
      );
    case 'microsoft':
      return (
        <svg {...props}>
          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
        </svg>
      );
  }
}

// The platforms whose standalone installer the site hands out directly.
type DirectPlatform = 'macos' | 'windows' | 'linux';

// `covers` is what the block says under the word Download — who the build is
// for, in the words someone buying an AI assistant would use. Not the file
// extension: Studio is not a developer tool, and a visitor who has to know what
// a .dmg is before they can click has been asked the wrong question. The
// extension stays out of the block entirely; on Linux, whose audience does read
// in package formats, the .deb is named in the line underneath.
const DIRECT_PLATFORM: Record<
  DirectPlatform,
  { mark: PlatformMark; name: string; platform: ReleasePlatform; format: string; covers: string }
> = {
  macos: { mark: 'apple', name: 'Mac', platform: 'darwin', format: '.dmg', covers: 'Apple Silicon' },
  windows: { mark: 'microsoft', name: 'Windows', platform: 'win32', format: '.exe', covers: 'Windows 11' },
  linux: { mark: 'linux', name: 'Linux', platform: 'linux', format: '.deb', covers: 'Debian, Ubuntu' },
};

/**
 * The hero's download button.
 *
 * Deliberately not a store badge. This download comes from us, not a store, and
 * dressing it in a store's badge shape would read as an imitation of one — the
 * same plate and mark, promising a listing it does not lead to. So it is the
 * plain black (or, on a dark page, white) plate with the platform mark leading
 * the label, which names the platform too.
 *
 * It points at the API's tracked redirect (/v1/releases/download/:platform),
 * which logs the hit and 302s to the artifact — so unlike a store link it is measurable end to end, needs
 * no account to accept, and ships the moment a release is published rather than
 * when review clears.
 */
// Primary is the brand pink, for the download the visitor most likely wants;
// secondary is the plain panel, for the other platforms.
type ButtonVariant = 'primary' | 'secondary';

const variantClass = (base: string, variant: ButtonVariant) =>
  variant === 'secondary' ? `${base} ${styles.secondary}` : base;

export function DirectDownloadButton({
  platform,
  variant = 'primary',
}: {
  platform: DirectPlatform;
  variant?: ButtonVariant;
}): ReactNode {
  const { mark, name, platform: releasePlatform, format } = DIRECT_PLATFORM[platform];
  const path = useInstallerUrl()(releasePlatform);

  return (
    <a
      href={path}
      download
      className={variantClass(styles.directCta, variant)}
      aria-label={`Download Smartloop Studio for ${name} (${format})`}
    >
      <Mark name={mark} />
      {/* Names the platform, as Cursor's and Claude's hero buttons do: the
          visitor sees which build they are getting before they click. */}
      <span>Download for {name}</span>
    </a>
  );
}

/**
 * The same download as a block, for the download page's cards.
 *
 * It says Download, then who the build is for and how big it is. The card
 * header already names the platform, so the block does not repeat it — and it
 * does not lead with the file extension either: that is how a developer tool
 * labels its downloads, and the visitor this page is for wants to know that
 * clicking gets them the app, not what a .dmg is.
 */
export function DirectDownloadBlock({
  platform,
  size,
  variant = 'primary',
}: {
  platform: DirectPlatform;
  // Unknown until the release fetch returns; the block reads fine without it.
  size?: string;
  variant?: ButtonVariant;
}): ReactNode {
  const { mark, name, platform: releasePlatform, format, covers } = DIRECT_PLATFORM[platform];
  const path = useInstallerUrl()(releasePlatform);

  return (
    <a
      href={path}
      download
      className={variantClass(styles.directBlock, variant)}
      aria-label={`Download Smartloop Studio for ${name} (${size ? `${format}, ${size}` : format})`}
    >
      <Mark name={mark} />
      <span className={styles.directBlockText}>
        <span className={styles.directBlockFormat}>Download</span>
        <span className={styles.directBlockMeta}>
          {size ? `${covers} · ${size}` : covers}
        </span>
      </span>
    </a>
  );
}

/**
 * Linux's lead download, drawn as our own button rather than Snapcraft's badge
 * so all three platforms read as one set. It opens the Snap Store listing,
 * which installs the snap and keeps it updated; the meta line says so, since
 * unlike the Mac and Windows buttons this one does not start a file download.
 */
export function SnapStoreButton({ variant = 'primary' }: { variant?: ButtonVariant } = {}): ReactNode {
  return (
    <a
      href={SNAP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={variantClass(styles.directCta, variant)}
      aria-label="Get Smartloop Studio for Linux from the Snap Store"
    >
      <Mark name="linux" />
      <span>Download</span>
    </a>
  );
}

/** The Snap Store button as a block, for the download page's Linux card. */
export function SnapStoreBlock({ variant = 'primary' }: { variant?: ButtonVariant } = {}): ReactNode {
  return (
    <a
      href={SNAP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={variantClass(styles.directBlock, variant)}
      aria-label="Get Smartloop Studio for Linux from the Snap Store"
    >
      <Mark name="linux" />
      <span className={styles.directBlockText}>
        <span className={styles.directBlockFormat}>Download</span>
        <span className={styles.directBlockMeta}>Snap Store · any distro</span>
      </span>
    </a>
  );
}
