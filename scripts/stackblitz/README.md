# Examples on StackBlitz

Open an example to install its dependencies, build it from source, and start the
preview automatically:

- [Parallel News](https://stackblitz.com/github/serkodev/nuxt-pages-plus?startScript=stackblitz%3Aparallel-news&file=examples%2Fparallel-news%2Fpages%2Findex.vue)
- [Modal Gallery](https://stackblitz.com/github/serkodev/nuxt-pages-plus?startScript=stackblitz%3Amodal-gallery&file=examples%2Fmodal-gallery%2Fpages%2Findex.vue)

The links use StackBlitz's `startScript` parameter to select a script from the root
`package.json`. Each script calls `node scripts/stackblitz/start.mjs <example>`.
Without a selection, the root `.stackblitzrc` starts Modal Gallery.

The launcher installs the dependencies locked in this directory, prepares the
module and base layer, builds the selected example, and starts its Nuxt production server on port
3000. The first load needs time to install and compile before the preview appears.
No generated application assets are stored in the repository.

Both examples use the repository's `src/` module and `examples/base` layer directly.
This npm dependency set keeps the documentation and other workspaces out of the
browser installation. Rolldown is pinned to 1.2.4 for WebContainer compatibility.
Keep framework versions aligned with the workspace when upgrading dependencies,
and verify a fresh StackBlitz build before changing the Rolldown pin.

The GitHub import links load the repository's default branch. Changes must be
published to that branch before they appear in a newly opened preview. Local
uncommitted changes are not available through these links. A saved StackBlitz fork
is a separate copy and does not automatically follow GitHub. This production
preview does not hot reload edits; stop its terminal process and rerun
`npm run stackblitz:parallel-news` or `npm run stackblitz:modal-gallery` to build the
edited source again.

To update the browser lockfile from the repository root:

```sh
npm install --prefix scripts/stackblitz --package-lock-only --ignore-scripts --legacy-peer-deps --no-audit --no-fund
```

The launcher expects a fresh checkout and refuses to replace an existing local
`node_modules` directory. Normal local development continues to use pnpm.
