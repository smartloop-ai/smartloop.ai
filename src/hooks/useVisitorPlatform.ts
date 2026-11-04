import { useEffect, useState } from 'react';

export type VisitorPlatform = 'macos' | 'linux' | 'windows' | 'unknown';

/**
 * The visitor's desktop platform, read from the browser once it has mounted.
 * Null on the server and on first paint, so the static HTML never guesses.
 */
export default function useVisitorPlatform(): VisitorPlatform | null {
  const [platform, setPlatform] = useState<VisitorPlatform | null>(null);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const navPlatform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();

    if (navPlatform.includes('mac') || userAgent.includes('mac os')) setPlatform('macos');
    else if (navPlatform.includes('linux') || userAgent.includes('linux')) setPlatform('linux');
    else if (navPlatform.includes('win') || userAgent.includes('windows')) setPlatform('windows');
    else setPlatform('unknown');
  }, []);

  return platform;
}
