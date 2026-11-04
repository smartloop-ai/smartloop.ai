import type {Plugin} from '@docusaurus/types';
import type {Options} from './types';

export default function pluginCanonicalUrls(
  context: any,
  options: Options,
): Plugin<void> {
  return {
    name: 'docusaurus-plugin-canonical-urls',

    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'canonical',
              href: `${context.siteConfig.url}${context.siteConfig.baseUrl}${context.pagePath}`,
            },
          },
        ],
      };
    },

    async contentLoaded({actions}) {
      const {setGlobalData} = actions;
      setGlobalData({
        canonicalUrl: `${context.siteConfig.url}${context.siteConfig.baseUrl}`,
      });
    },
  };
} 