# Modal Gallery on StackBlitz

Open the repository on StackBlitz:

https://stackblitz.com/github/serkodev/nuxt-pages-plus?file=examples/modal-gallery/pages/index.vue

The root `.stackblitzrc` runs `node scripts/stackblitz/start.mjs`. The launcher installs
the dependencies locked in this directory, prepares the module and base layer,
builds `examples/modal-gallery`, and starts its Nuxt production server on port
3000. The first load needs time to install and compile before the preview appears.
No generated application assets are stored in the repository.

The example uses the repository's `src/` module and `examples/base` layer directly.
This npm dependency set keeps the documentation and other workspaces out of the
browser installation. Rolldown is pinned to 1.2.4 for WebContainer compatibility.
Keep framework versions aligned with the workspace when upgrading dependencies,
and verify a fresh StackBlitz build before changing the Rolldown pin.

Use the GitHub import URL to load updated repository code. A saved StackBlitz fork
is a separate copy and does not automatically follow GitHub. This production
preview does not hot reload edits; stop its terminal process and rerun
`node scripts/stackblitz/start.mjs` to build the edited source again.

To update the browser lockfile from the repository root:

```sh
npm install --prefix scripts/stackblitz --package-lock-only --ignore-scripts --legacy-peer-deps --no-audit --no-fund
```

The launcher expects a fresh checkout and refuses to replace an existing local
`node_modules` directory. Normal local development continues to use pnpm.
