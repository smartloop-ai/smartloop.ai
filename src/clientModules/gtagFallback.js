/**
 * `@docusaurus/plugin-google-gtag` disables itself outside production, but its
 * client module still calls `window.gtag()` on every route change. When the
 * snippet is missing (dev, or a blocked analytics script) that throws a
 * TypeError on navigation. Install a no-op that buffers into dataLayer instead.
 *
 * Client modules are evaluated at bootstrap, so this runs before the first
 * `onRouteDidUpdate`. In production the real snippet defines `gtag` in <head>
 * first, so this is a no-op there.
 */
if (typeof window !== 'undefined' && typeof window.gtag !== 'function') {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
}
