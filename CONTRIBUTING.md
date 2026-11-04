# Contributing

Thanks for helping improve smartloop.ai and its docs.

By contributing, you agree that your documentation changes are licensed under
[CC BY 4.0](LICENSE-docs) and your code changes under the [MIT License](LICENSE),
the same as the rest of the repo.

## Small fixes

For a typo, a broken link or a sentence that's out of date, use the **Edit this
page** link at the bottom of any docs page. GitHub forks the repo for you,
lets you edit in the browser and opens a pull request.

## Larger changes

1. **Open an issue first** for a new page, a restructure or a change to the
   site's pages, so we can agree on the shape before you spend time on it.
2. **Fork and branch.** Branch from `main` with a short descriptive name, for
   example `docs-mcp-oauth`.
3. **Run it locally.** `npm ci && npm start`, then check your change at
   http://localhost:3000 in light and dark mode, and at phone width.
4. **Build before pushing.** `npm run build` fails on broken links and
   `npm run typecheck` on type errors. CI runs both on every pull request.
5. **Open a pull request** against `main`. Say what changed and why, and add a
   screenshot for anything visual. Once it's merged, it deploys on its own.

## Writing style

- Write for someone using Studio or Docent, not someone building it. Lead with
  what they can do, then how.
- Short sentences, second person ("you"), present tense.
- Name UI elements exactly as they appear, in **bold**: **Settings** →
  **Web search**.
- Use code blocks for commands and config, and say what the reader should see
  afterwards.
- Keep one term for one thing across pages: a *project*, a *skill*, an
  *MCP server*.

## Images and media

- Put images next to the page that uses them in `docs/`, or under `static/img/`
  if more than one page uses them.
- Prefer PNG or WebP for screenshots and keep them under about 500 KB. Crop to
  what matters.
- Give every image alt text that says what it shows.
- Video goes in as MP4. Avoid GIFs over a couple of MB.

## Commits

Write commit messages that say what the change does, in the imperative:
"Document MCP OAuth sign-in", not "updates". One logical change per pull
request makes review faster.

## Reporting problems

Open an issue with the page URL, what you expected and what you saw. For a
problem with Studio or Docent itself rather than the docs, use the
[Docent repo](https://github.com/smartloop-ai/docent/issues).
