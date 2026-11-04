# smartloop.ai

The Smartloop website and docs: a static [Docusaurus](https://docusaurus.io/) site
served from GitHub Pages.

## Develop

```
npm install
npm start          # dev server with live reload
npm run build      # static site in ./build
npm run serve      # serve ./build
```

The build fetches the latest Studio release from the Smartloop API and the latest
Docent version from GitHub, and bakes both into the pages. Set `SLP_API_BASE_URL`
to point the site at a local API.

## How it is hosted

- **Pages.** Every merge to `main` deploys (`.github/workflows/deploy-pages.yml`).
  It also runs daily and on a `release-published` repository dispatch, so a new
  release reaches the download page without a commit. `static/CNAME` holds the
  custom domain.
- **API.** The contact form (`POST /v1/contact`) and the tracked, rate-limited
  installer downloads (`GET /v1/releases/download/{platform}`) are routes on the
  Smartloop API (`slp-api`, Supabase) at `api.smartloop.ai`. See `src/utils/api.ts`.
- **Redirects.** Pages can't redirect, so Cloudflare does it in front of the site
  (`slp-infra-project/cloudflare/website.tf`): `www.` to the apex, the retired
  `docs.smartloop.ai` host, `/docs/` and `/docs/use-cases/*`, the old
  `/:platform/release` download links, and `/install*` to the current scripts in
  the docent repo.
