import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro', // '.' means the root of the docs folder
    },
    {
      type: 'doc',
      id: 'getting-started',
    },
    {
      type: 'doc',
      id: 'documents',
    },
    {
      type: 'doc',
      id: 'model-orchestration',
    },
    {
      type: 'doc',
      id: 'skills',
    },
    {
      type: 'doc',
      id: 'mcp-servers',
    },
    {
      type: 'doc',
      id: 'web-search',
    },
    {
      type: 'doc',
      id: 'customizing-theme',
    },
    {
      type: 'doc',
      id: 'memory',
    },
    {
      type: 'doc',
      id: 'command-line-tool',
    },
    {
      type: 'doc',
      id: 'coding',
    },
    {
      type: 'doc',
      id: 'local-ai',
    },
    {
      type: 'category',
      label: 'Use cases',
      collapsed: false,
      items: ['templates/legal'],
    },


  ]
};

export default sidebars;
