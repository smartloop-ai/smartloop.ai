import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Smartloop API (slp-api). Override to point the site at a local one.
const apiBaseUrl = process.env.SLP_API_BASE_URL ?? 'https://api.smartloop.ai';

// Fetch the latest published release once, at build time, and bake it into the
// site config (see customFields.latestRelease). Pages then read the version and
// download artifacts synchronously with no per-visit API call — rebuild to pick
// up a newer release. A failed fetch degrades to null (downloads show as
// temporarily unavailable) rather than breaking the build.
async function fetchLatestRelease(channel = 'stable') {
  try {
    const response = await fetch(
      `${apiBaseUrl}/v1/releases/latest?channel=${encodeURIComponent(channel)}`,
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const release = data.release ?? null;
    if (!release) return null;
    // customFields ships to every visitor in the JS bundle, so keep only what
    // the pages render. The artifact URLs stay server-side: downloads go
    // through the API's /v1/releases/download/:platform, which rate-limits
    // them, and a direct CDN link in the bundle would let a scraper skip that.
    return {
      ...release,
      artifacts: (release.artifacts ?? []).map(
        ({ platform, arch, kind, size }) => ({ platform, arch, kind, size }),
      ),
    };
  } catch (error) {
    console.warn(
      `[docusaurus] Could not fetch latest release from ${apiBaseUrl}: ` +
        `${(error as Error).message}. Download links will be unavailable in this build.`,
    );
    return null;
  }
}

// Docent (the CLI) ships through GitHub releases, not the releases API, so its
// version comes from there, also once at build time. Null hides the badge.
async function fetchDocentVersion() {
  try {
    const response = await fetch(
      'https://api.github.com/repos/smartloop-ai/docent/releases/latest',
      { headers: { Accept: 'application/vnd.github+json' } },
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return typeof data.tag_name === 'string' ? data.tag_name.replace(/^v/, '') : null;
  } catch (error) {
    console.warn(
      `[docusaurus] Could not fetch the latest Docent release: ${(error as Error).message}.`,
    );
    return null;
  }
}

const config = async (): Promise<Config> => {
  const [latestRelease, docentVersion] = await Promise.all([
    fetchLatestRelease(),
    fetchDocentVersion(),
  ]);

  return {
  title: 'Smartloop',
  tagline: 'Your Local AI mission control for extracting, orchestrating, and automating tasks with LLMs and AI agents.',
  favicon: 'img/favicon.ico',

  url: 'https://smartloop.ai',
  baseUrl: '/',
  trailingSlash: true,

  organizationName: 'smartloop-ai',
  projectName: 'smartloop.ai',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  customFields: {
    // Latest release fetched at build time; read via useLatestRelease().
    latestRelease,
    // Latest Docent CLI version (no leading v), for the /docent page.
    docentVersion,
    // Contact form and installer downloads; see src/utils/api.ts.
    apiBaseUrl,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    async function twailwindPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
    [
      '@docusaurus/plugin-google-tag-manager',
      {
        containerId: 'GTM-NK2GKZSM',
      },
    ],
  ],
  clientModules: [
    require.resolve('./src/clientModules/gtagFallback.js'),
    require.resolve('./src/css/app.css'),
  ],
  presets: [
    [
      'classic',
      {
        // No blog yet. The classic preset enables one by default, which was
        // publishing Docusaurus' sample posts (and their tag/author pages)
        // onto smartloop.ai. Flip back to an options object when there is
        // something real to post.
        blog: false,
        docs: {
          sidebarPath: './sidebars.ts',
          // "Edit this page" on every doc, straight into a GitHub edit/PR.
          editUrl: 'https://github.com/smartloop-ai/smartloop.ai/edit/main/',
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-29YVZ0FB66',
          anonymizeIP: true,
        },
        // /support/ is a noindex redirect to /contact/ — keep it out of the
        // sitemap so the two never look like competing pages.
        sitemap: {
          ignorePatterns: ['/support/'],
          // Search engines ignore changefreq and a flat 0.5 priority says
          // nothing, so drop both; lastmod (from git) is what they read.
          lastmod: 'date',
          changefreq: null,
          priority: null,
          // List the home page first.
          createSitemapItems: async ({ defaultCreateSitemapItems, ...rest }) => {
            const items = await defaultCreateSitemapItems(rest);
            return items.sort(
              (a, b) =>
                Number(b.url === 'https://smartloop.ai/') -
                Number(a.url === 'https://smartloop.ai/'),
            );
          },
        },
      } satisfies Preset.Options,
    ],
  ],
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap',
      },
    },
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/smartloop-social-card.png',
  metadata: [
      { name: 'description', content: 'A local AI assistant that runs entirely on your own machine. Curated open models, document and OCR reading, MCP tools, and reusable skills — with your data staying on-device.' },
      { name: 'keywords', content: 'gpt, work, AI, agent, local AI, small language model, SLM, MCP servers, local LLM, on-device AI, smartloop' },
      { name: 'author', content: 'Smartloop' },
      { property: 'og:title', content: 'Smartloop | Frontier quality. Local first.' },
      { property: 'og:description', content: 'A local AI assistant that runs entirely on your own machine. Curated open models, document and OCR reading, MCP tools, and reusable skills — with your data staying on-device.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://smartloop.ai/img/smartloop-social-card.png?v=3' },
      { property: 'og:image:secure_url', content: 'https://smartloop.ai/img/smartloop-social-card.png?v=3' },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Smartloop — Frontier quality. Local first.' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://smartloop.ai/img/smartloop-social-card.png?v=3' },
    ],
    colorMode: {
      // Light for everyone on a first visit, whatever the system setting; the
      // navbar toggle still switches, and the choice is remembered.
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      logo: {
        alt: 'Smartloop Logo',
        src: 'img/logo-dark.svg',
        srcDark: 'img/logo.svg',
        href: '/'
      },
      items: [
        {
          href: 'https://github.com/smartloop-ai',
          className: 'navbar-item-github invert',
          'aria-label': 'GitHub repository',
          position: 'right',
        }

      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    codeBlock: {
      wordWrap: true,
    },
  } satisfies Preset.ThemeConfig
  };
};

export default config;
