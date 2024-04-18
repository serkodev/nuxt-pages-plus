![Nuxt banner](./.github/assets/banner.svg)

# Nuxt Pages Plus

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module that enables complex routing for Nuxt Pages.

> [!IMPORTANT]
> This project is in beta. APIs and features may change without notice. If you decide to use it in a production environment, please assess the risks on your own. Your suggestions and contributions are welcome! Feel free to submit issues or pull requests.

## Features

- 🛤️ &nbsp;Parallel Routes - Render multiple pages in a single route, synchronously or manually.
- 🖼️ &nbsp;Modal Routes - Navigate modals routes with real-time URL changes for seamless browsing.
- 📁 &nbsp;File-base Routing - Create named routes right inside pages directory of your Nuxt project.
- 🔋 &nbsp;SSR Friendly - Optimized for Nuxt server-side rendering and static site generation.
- ⚙️ &nbsp;Comprehensive Toolkit - Extensive components and composables for flexible usage and easy integration.
- 🛠 &nbsp;Flexible - Tailor settings globally or for specific pages; fully customizable.

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

## Documentation

Please refer to the [Nuxt Pages Plus documentation](https://nuxt-pages-plus.pages.dev/) for detailed usage and examples.

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
