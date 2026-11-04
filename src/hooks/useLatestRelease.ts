import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Mirrors the response models in slp-api (app/db/models/release.py). The latest
// release is fetched once at build time (see docusaurus.config.ts) and baked
// into siteConfig.customFields, so pages read it synchronously with no runtime
// API call — the version is present at first paint and never causes a layout
// shift. Rebuild/redeploy to pick up a newer release.

export type ArtifactPlatform = 'darwin' | 'win32' | 'linux';
export type ArtifactArch = 'x64' | 'arm64' | 'universal';

// dmg/nsis/deb are the user-facing installers. zip (Squirrel.Mac) and appimage
// are auto-update payloads and must never be offered as a download link.
export type ArtifactKind = 'dmg' | 'zip' | 'nsis' | 'appimage' | 'deb';

// url and sha512 are stripped at build time (docusaurus.config.ts) so the bundle
// never carries a direct CDN link; downloads go through the API (src/utils/api.ts).
export type ReleaseArtifact = {
  platform: ArtifactPlatform;
  arch: ArtifactArch;
  kind: ArtifactKind;
  size: number;
};

export type Release = {
  id: string;
  version: string;
  name: string;
  notes: string;
  channel: string;
  status: 'draft' | 'published' | 'revoked';
  published_at: string | null;
  artifacts: ReleaseArtifact[];
  min_version: string | null;
  created_at: string;
  updated_at: string;
};

export type LatestRelease =
  | { status: 'loading'; release: null }
  | { status: 'ready'; release: Release }
  | { status: 'unavailable'; release: null };

/**
 * Read the latest published release baked into the site config at build time.
 *
 * The release is fetched once during the build (docusaurus.config.ts) and
 * exposed via customFields.latestRelease, so this resolves synchronously with
 * no network request. If the build-time fetch failed, latestRelease is null and
 * the status is 'unavailable' — from the page's point of view there is nothing
 * to download.
 */
export default function useLatestRelease(): LatestRelease {
  const { siteConfig } = useDocusaurusContext();
  const release = (siteConfig.customFields?.latestRelease ?? null) as Release | null;

  return release
    ? { status: 'ready', release }
    : { status: 'unavailable', release: null };
}

/** First artifact matching a platform/kind pair, or null. */
export function findArtifact(
  release: Release | null,
  platform: ArtifactPlatform,
  kind: ArtifactKind,
): ReleaseArtifact | null {
  if (!release) return null;
  return (
    release.artifacts.find((a) => a.platform === platform && a.kind === kind) ??
    null
  );
}

/**
 * Bytes as a human-readable size, e.g. 174685583 -> "166.6 MB".
 *
 * Studio's installers bundle models and run past a gigabyte, so anything that
 * large is reported in GB rather than as a four-digit MB figure.
 */
export function formatSize(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
}
