# nuxt-pages-plus

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module that enables complex routing for Nuxt Pages.

> [!IMPORTANT]
> This project is in beta and under development. APIs and features may change without notice. Please do not use in production. Your suggestions and contributions are welcome! Feel free to submit issues or pull requests.

## Features

- 🛤️ &nbsp;Parallel Routes - Render multiple Nuxt pages within a single route, either synchronously or manually.
- 🖼️ &nbsp;Modal Routes - Display a modal in your routes with updating url.
- ⛰️ &nbsp;File-base Routing - Create named routes right inside pages directory of your Nuxt project.
- 🛠 &nbsp;Flexible - Fully customizable and configurable for global or specific pages.
- 🔋 &nbsp;SSR Friendly - Works perfectly with Nuxt SSR / SSG.

## Table of Contents
- [Quickstart](#quickstart)
- [Usage](#usage)
  - [Parallel Routes](#parallel-routes)
  - [Modal Routes](#modal-routes)
  - [Advanced Usage](#advanced-usage)
- [File-based Routing](#file-based-routing)
  - [Escape `@` separator](#escape--separator)
    - [Customize separator symbol](#customize-separator-symbol)
    - [Ignore Parallel Routes](#ignore-parallel-routes)
    - [Customize Parallel Routes](#customize-parallel-routes)
- [Contribution](#contribution)
- [Inspiration](#inspiration)

## Quickstart

Install the module to your Nuxt application with `nuxi` command:

```sh
npx nuxi module add nuxt-pages-plus
```

<details>
  <summary>Install manually</summary>

  ```sh
  npm i -D nuxt-pages-plus
  ```

  ```ts
  // nuxt.config.ts
  export default defineNuxtConfig({
    modules: ['nuxt-pages-plus']
  })
  ```
</details>

## Usage

### Parallel Routes

Parallel Routes allows you to render multiple Nuxt pages within a single route, either synchronously or manually. ([Example](./examples/parallel-sidebar-layout))

```html
<!-- layouts/default.vue -->
<template>
  <div>
    <slot />
    <PlusParallelPage name="foo" />
  </div>
</template>

<!-- pages/index.vue -->
<template>
  <div>Index</div>
</template>

<!-- pages/index@foo.vue -->
<template>
  <div>Index foo</div>
</template>

<!-- pages/about.vue -->
<template>
  <div>About</div>
</template>

<!-- pages/about@foo.vue -->
<template>
  <div>About foo</div>
</template>
```

```html
<!-- output: http://localhost/ -->
<div>
  <div>Index</div>
  <div>Index foo</div>
</div>

<!-- output: http://localhost/about -->
<div>
  <div>About</div>
  <div>About foo</div>
</div>
```

### Modal Routes

You need to change `NuxtPage` to `PlusModalNuxtPage` in order to use the Modal Routes feature. ([Example](./examples/modal-basic))

```diff
<!-- app.vue -->
<template>
  <NuxtLayout>
-    <NuxtPage />
+    <PlusModalNuxtPage />
  </NuxtLayout>
</template>
```

```html
<!-- pages/index.vue -->
<template>
  <div>
    <PlusModalLink to="/info">
      Open info modal
    </PlusModalLink>

    <PlusModalPage name="modal" />

    <NuxtLink to="/info">
      Go to info page
    </NuxtLink>
  </div>
</template>

<!-- pages/info@modal.vue -->
<template>
  <Teleport to="body">
    <div>
      Info modal
      <button @click="$modalRouter.close()">Close</button>
    </div>
  </Teleport>
</template>

<!-- pages/info.vue -->
<template>
  <div>
    Info page
  </div>
<template>
```

### Advanced Usage

For more advanced usage, please refer to the [/examples](./examples/) directory. Detailed documentation  will be released soon.

## File-based Routing

All named parallel routes page files (`...@*.vue`) should be placed in the [`~/pages/`](https://nuxt.com/docs/guide/directory-structure/pages) directory. Nuxt Pages Plus will process these files and generate parallel routes after Nuxt has generated the routes.

You can place your parallel routes pages in several different ways.

| File Path                  | Name | Route             | Description                       |
| -------------------------- | ---- | ----------------- | --------------------------------- |
| `index@foo.vue`            | foo  | /                 | name in index file                |
| `@foo/index.vue`           | foo  | /                 | name in root folder               |
| `@foo.vue`                 | foo  | /                 | name in root folder without index |
| `about/us@foo.vue`         | foo  | /about/us         | name in file of folder            |
| `about/us@foo/contact.vue` | foo  | /about/us/contact | name in sub folder                |

<details>
  <summary>Nested name (Advanced)</summary>

  Nuxt Pages Plus supports nested name file-based routing, which can be used in nested parallel routes. Due to its complexity, more detailed explanations will be provided in future documentation.

  | File Path              | Name    | Route     | Description                    |
  | ---------------------- | ------- | --------- | ------------------------------ |
  | `@foo/@bar/about.vue`  | foo/bar | /about    | nested name                    |
  | `about@foo/us@bar.vue` | foo/bar | /about/us | nested name in file and folder |
  | `@foo@bar/about.vue`   | foo/bar | /about    | multiple nested name in folder |
  | `about/us@foo@bar.vue` | foo/bar | /about/us | multiple nested name in file   |
</details>

### Escape `@` separator

Supporting named views could lead to conflicts with certain routes, e.g. including the `@` symbol in the route. Nuxt Pages Plus provided some options to address this problem.

#### Customize separator symbol

This allows you to use `index+foo.vue` as Parallel Routes. ([Example](./examples/parallel-separator/nuxt.config.ts))

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  ...
  pagesPlus: {
    separator: '+',
  },
})
```

#### Ignore Parallel Routes

By setting `parallel.ignore` in the page meta, your Parallel Routes will be ignored. ([Example](./examples/parallel-page-meta/pages/@right/index.vue))

```html
<!-- /pages/[user]@[host].vue -->
<script setup lang="ts">
definePageMeta({
  parallel: { ignore: true },
})
</script>
```

#### Customize Parallel Routes

By setting `parallel.name` and `parallel.path` in the page meta to override the processing of the route. ([Example](./examples/parallel-page-meta/pages/index@left.vue))

```html
<!-- /pages/[user]@foo@bar.vue -->
<script setup lang="ts">
definePageMeta({
  parallel: {
    path: '[user]@foo'
    name: 'bar',
  },
})
</script>
```

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm dev:prepare
  
  # Develop with the examples
  pnpm dev examples/...

  # Develop with the playground
  pnpm play
  
  # Build the playground
  pnpm play:build

  # Run ESLint
  pnpm lint
  
  # Run Vitest
  pnpm test
  pnpm test:watch
  
  # Release new version
  pnpm release
  ```

</details>

## Inspiration

This module is inspired by Next.js [App Router](https://app-router.vercel.app/). Many thanks to [Anthony Fu](https://github.com/antfu) for providing the opinion of implementing Parallel Routes feature using Nuxt.

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-pages-plus/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-pages-plus

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-pages-plus.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-pages-plus

[license-src]: https://img.shields.io/npm/l/nuxt-pages-plus.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-pages-plus

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
