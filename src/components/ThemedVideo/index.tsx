import { type ReactNode } from 'react';
import { ThemedComponent } from '@docusaurus/theme-common';

type Props = {
  /** What the recording shows, for screen readers. */
  label: string;
  sources: { light: string; dark: string };
};

// A looping, silent screencast with a light and a dark recording, picked the
// way ThemedImage picks an image: both render during SSR and CSS hides the
// other theme's until the page knows which one is active.
export default function ThemedVideo({ label, sources }: Props): ReactNode {
  return (
    <ThemedComponent>
      {({ theme, className }) => (
        <video
          key={theme}
          className={className}
          src={sources[theme]}
          aria-label={label}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
    </ThemedComponent>
  );
}
