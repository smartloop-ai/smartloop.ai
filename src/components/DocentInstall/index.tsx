import { useState, useEffect, type ReactNode } from 'react';
import styles from './styles.module.css';

type Shell = 'unix' | 'windows';

// smartloop.ai/install* redirect (Cloudflare) to the scripts in the docent
// repo, so the one-liners always hand out the current script. The deploy also
// copies them into the site as a fallback (.github/workflows/deploy-pages.yml).
const installCommands: Record<Shell, string> = {
  unix: 'curl -fsSL https://smartloop.ai/install | sh',
  windows: 'irm https://smartloop.ai/install.ps1 | iex',
};

// `location` tags the copy event in analytics (homepage vs /docent).
export default function DocentInstall({ location = 'home' }: { location?: string }): ReactNode {
  const [shell, setShell] = useState<Shell>('unix');
  const [copied, setCopied] = useState(false);

  // Windows visitors land on the PowerShell line; everyone else gets curl.
  useEffect(() => {
    if (/win/i.test(navigator.platform) || /windows/i.test(navigator.userAgent)) setShell('windows');
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(installCommands[shell]);
      setCopied(true);
      (window as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'docent_install_copy', { platform: shell, location });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the command is still selectable */
    }
  };

  return (
    <div className={styles.install}>
      <div className={styles.installTabs} role="tablist" aria-label="Platform">
        {([['unix', 'macOS · Linux'], ['windows', 'Windows']] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={shell === key}
            className={`${styles.installTab} ${shell === key ? styles.installTabActive : ''}`}
            onClick={() => setShell(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.installRow}>
        <code><span>{shell === 'windows' ? '>' : '$'}</span>{installCommands[shell]}</code>
        <button type="button" className={styles.copy} onClick={copy}>{copied ? 'copied' : 'copy'}</button>
      </div>
    </div>
  );
}
