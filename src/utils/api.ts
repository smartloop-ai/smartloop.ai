import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// The site is static (GitHub Pages), so everything that needs a server lives
// on the Smartloop API (slp-api, Supabase): the contact form and the tracked
// installer downloads. Its base URL is baked in at build time; see
// customFields.apiBaseUrl in docusaurus.config.ts.

export type ReleasePlatform = 'darwin' | 'win32' | 'linux';

export function useApiBaseUrl(): string {
  const { siteConfig } = useDocusaurusContext();
  return (siteConfig.customFields?.apiBaseUrl as string) ?? 'https://api.smartloop.ai';
}

/**
 * The tracked installer download for a platform. The API logs the hit,
 * rate-limits it per address, and 302s to the artifact — the bundle never
 * carries a direct CDN link a scraper could loop on. `arch` picks the build
 * where a platform ships more than one (Linux: x64 and arm64).
 */
export function useInstallerUrl(): (platform: ReleasePlatform, arch?: 'x64' | 'arm64') => string {
  const base = useApiBaseUrl();
  // Without arch the API serves x64 where a platform ships both.
  return (platform, arch) =>
    `${base}/v1/releases/download/${platform}${arch ? `?arch=${arch}` : ''}`;
}

export type ContactRequest = {
  name: string;
  email: string;
  company?: string;
  notes: string;
  inquiry?: 'contact' | 'partner';
} & Record<string, string | undefined>;

/** The API answers errors as {detail}, a string or a FastAPI-style list. */
function errorMessage(status: number, data: any): string {
  if (status === 429) return 'Too many messages from this address. Please try again later.';
  const detail = data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length) {
    const field = detail[0]?.loc?.[1];
    if (field === 'email') return 'Email address is invalid';
    if (field === 'notes') return 'Please enter a message';
    if (field === 'name') return 'Please enter your name';
  }
  return 'Failed to send message';
}

export async function sendContactRequest(apiBaseUrl: string, body: ContactRequest): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/v1/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(errorMessage(response.status, data));
  }
}
