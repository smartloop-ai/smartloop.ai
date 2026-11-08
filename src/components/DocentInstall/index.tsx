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

function CopyIcon({ done }: { done: boolean }): ReactNode {
  const props = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  return done
    ? <svg {...props}><polyline points="20 6 9 17 4 12" /></svg>
    : <svg {...props}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
}

// `location` tags the copy event in analytics (homepage vs /docent).
// `variant="hero"` is the centered, frameless version for a page's hero.
export default function DocentInstall({ location = 'home', variant = 'card' }: { location?: string; variant?: 'card' | 'hero' }): ReactNode {
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
    <div className={`${styles.install} ${variant === 'hero' ? styles.hero : ''}`}>
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
        <button type="button" className={styles.copy} onClick={copy} aria-label="Copy the install command">
          {variant === 'hero' && <CopyIcon done={copied} />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
    </div>
  );
}
