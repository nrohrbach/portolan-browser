# BAFU Geodaten

This fork shows one catalog, the BAFU Portolan catalog, in the Swiss federal look.

## What differs from Portolan Browser

- **Catalog.** One fixed catalog, no data source picker (`config.js`).
- **Title and languages.** "BAFU Geodaten", `de-CH`, `fr-CH`, `it-CH` and `en` (`config.js`).
- **Basemaps.** swisstopo vector tile styles. The map starts over central Europe and flies in to the data. Afterwards it stays near Switzerland (`basemaps.config.js`).
- **Theme.** Palette of [swiss/designsystem](https://github.com/swiss/designsystem) and self-hosted Noto Sans (`src/theme/`).
- **Federal logo.** Unmodified `BundLogo.svg` from the design system (`src/components/BundLogo.vue`).
- **Footer.** Contact, legal link and build info in four languages (`src/components/BafuFooter.vue`). The version is the commit hash, set at build time in `vite.config.js`.
- **Deployment.** GitHub Pages workflow (`.github/workflows/deploy-demo.yml`).

## Switch to another catalog

Set `catalogUrl` and add the host to `allowedDomains` in `config.js`. For a build, set the
variables instead: `SB_catalogUrl` and `SB_allowedDomains='["host.example"]'`.

## Deploy to GitHub Pages

In the repository settings, set **Pages > Source** to **GitHub Actions**. A push to `main` builds
and publishes the site. The workflow sets `SB_pathPrefix` to `/<repository name>/`.

## Open points before production

- **Federal logo.** The Federal Chancellery CD rules apply. BAFU communication must approve the
  header and footer text.
- **Basemap terms.** `basemap` and `imagerybasemap` need permission for commercial use. Confirm
  with swisstopo. `lightbasemap` is open with a source reference.
- **Basemap check.** Confirm in a browser that labels render. A style without `glyphs` draws no text.
- **CORS.** The catalog bucket must allow range requests from the site origin.
- **Map colors.** Data layers still use the upstream blue `#4163cc` in `StacMapLayer.js`.
