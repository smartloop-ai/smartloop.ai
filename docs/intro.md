# Intro

This guide will help you get started with agent orchestration, learn key concepts, and make the most of Smartloop.

## What is Smartloop?

Smartloop is a local AI solution to deliver frontier quality using open-source models. It runs 100% on your device, without any complex setup requirements and does the hardware math for you.

At its core, it uses a system-1 (trained in-house) model simulate a control plane, selecting the models needed to answer a given prompt. Instead of relying on a single large model, it uses a capability-based agentic approach that breaks a problem into smaller tasks, delivering comparable results without the infrastructure, cloud, and tokens that much larger models require. Selection weighs each model's capabilities, size, and other factors, while staying within the boundary of your device.

<video src="/img/info-doc-v2.mp4" autoPlay loop muted playsInline style={{width: '100%', borderRadius: '8px'}} />

## What you can do

- **Ask questions across your own documents.** Drop PDFs, Office files, text, or images into a project and a single prompt can draw on all of them at once, with the sources it used shown alongside the answer. See [Bring your documents](./documents.md).
- **Extract information from images and files.** Attach a scan, screenshot, or photo to a prompt and pull structured details out of it — a vision model does the reading. Useful for forms, IDs, receipts, and scanned pages.
- **Generate new content.** Ask for summaries, comparisons, tables, or drafts grounded in your project's context rather than written from a blank page.
- **Pack repetitive prompts into skills.** A skill is a markdown file describing a task the assistant can run — analyzing documents, searching the web, and generating a consolidated report in one go. Run one by typing `/` in the prompt, or create a new one from a template. See [Skills](./skills.md).
- **Connect external systems.** Through the Model Context Protocol (MCP), the assistant can reach outside tools and data sources, so it can perform tasks such as creating a ticket. Notion, Linear, Trello, monday.com, and Canva connect in one click, and any other MCP server can be added by pasting its URL. See [Connections](./mcp-servers.md).
- **Search the web for current information.** A project can combine your documents with the latest data from the web — recommending a product, for instance — with every answer annotated with the sites it drew from. Search is hybrid: only the query leaves your machine, and local models read the pages and write the answer. No key or setup needed; every account gets a monthly allowance of searches, and you can buy more from your [dashboard](https://app.smartloop.ai/settings/websearch/). See [Web search](./web-search.md).
- **Control what it remembers.** A thumbs up or thumbs down on any response decides what enters the project's memory, so you don't supply the same context twice. See [Memory](./memory.md).
- **Build on the API.** Smartloop exposes an OpenAI-compatible endpoint for automating project creation, uploading documents, and integrating with your own applications. See [Local AI](./local-ai.md).
- **Work from the terminal.** The CLI runs Smartloop with or without Studio: it sets up the agent and models on first use, signs you in, manages projects and models, and chats with the assistant, showing the sources behind each answer. See [Docent - Command Line Interface](./command-line-tool.md).

## Where to start

1. [Getting started](./getting-started.md) — install Studio, sign in, and run your first prompt in General Chat.
2. [Bring your documents](./documents.md) — create a project and give it your own files.
3. [Skills](./skills.md) — automate a task you repeat.
4. [Connections](./mcp-servers.md) — let the assistant act on other systems.
5. [Web search](./web-search.md) — bring in current data from the web.
6. [Model Orchestration](./model-orchestration.md) — how model selection works under the hood.

## Contact
For more information, visit [Smartloop](https://smartloop.ai/) or reach out via email: hello@smartloop.ai.

---

© 2026 Smartloop Inc. | All rights reserved
