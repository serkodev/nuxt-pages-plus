# Compatibility matrix

Verifies the **packed module** (exactly what `pnpm publish` ships, including
resolved `catalog:` deps) against the boundary versions of every supported
Nuxt generation:

| Version | Generation |
| --- | --- |
| `3.16.0` | Nuxt 3 floor (vue-router 4, `@nuxt/kit` 3) |
| `3x` (latest 3.x) | Nuxt 3 latest |
| `4.0.3` | first Nuxt 4 line (vue-router 4, `@nuxt/kit` 4) |
| `4.3.1` | last vue-router-4-based Nuxt 4 |
| `4.4.2` | first vue-router-5-based Nuxt 4 |
| `latest` | latest Nuxt 4 (vue-router 5, native named views) |

For each version, a standalone copy of [`fixture/`](./fixture) is installed
with npm (like a real consumer app, so the module's own `@nuxt/kit` 4.x
dependency nests exactly as it would in production), then:

1. `nuxt prepare`
2. `vue-tsc --noEmit` — the fixture's [`composables/typeSurface.ts`](./fixture/composables/typeSurface.ts)
   exercises every public composable/type, so shipped d.ts breakage against
   that version's `@nuxt/schema` / `vue-router` types fails here
3. `nuxt build`
4. SSR smoke — parallel router extraction (incl. `name@view.vue` reclamation
   on Nuxt ≥ 4.5), `useParentRoute` param/query sync, fallback slots
5. browser smoke (playwright) — client navigation sync, modal open/close via
   `history.state`, modal-not-resurrected-after-reload

## Usage

```sh
pnpm test:matrix               # full default matrix
pnpm test:matrix 3x latest     # subset (exact versions, dist-tags, or ranges)
```

Env vars: `MATRIX_WORKDIR` (workdir, default `$TMPDIR/nuxt-pages-plus-matrix`),
`MATRIX_REUSE=1` (skip reinstall for fast iteration), `MATRIX_NO_BROWSER=1`
(skip the browser step).

## Caveats

- `CLI_OVERRIDES` in `run.mjs` pins an era-correct `@nuxt/cli` for old Nuxt 3
  minors: a fresh `npm i nuxt@3.16` today resolves nuxt's `@nuxt/cli` range to
  a 2026 CLI whose `@nuxt/schema ^4.x` peer gets hoisted to the app root and
  breaks old `@nuxt/kit` config loading (v4 defaults on a v3 core). That
  breakage exists without this module; the pin models a real (lockfile-era)
  3.16 app.
- The 4.0-line cell is `4.0.3`, not `4.0.0`: nuxt 4.0.0–4.0.2 ship
  nitropack 2.12.0, whose node-server output resolves the public assets dir to
  `server/chunks/public` and 500s every `/_nuxt/*` request on modern Node
  (reproduced with a bare app, no modules). On 4.0.0 this module still passes
  install / typecheck / build / SSR smoke; only the browser step is impossible.
