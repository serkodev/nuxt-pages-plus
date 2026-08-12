import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  extends: [
    'docus',
    resolve('../examples/base-utils'),
  ],
  modules: [
    resolve('../src/module'),
  ],
  devtools: { enabled: false },

  site: {
    url: 'https://nuxt-pages-plus.pages.dev',
    name: 'Nuxt Pages Plus',
  },

  nitro: {
    prerender: {
      // the interactive example pages are client-driven demos;
      // they are served by the SPA fallback instead of being prerendered
      ignore: [
        '/examples/',
      ],
    },
  },

  pagesPath: {
    basedPath: /examples\/[\w-]+\//,
  },

  pagesPlus: {
    // the modal routes demo uses `[id]@modal.vue` files, which Nuxt >= 4.5
    // would otherwise merge into the base route as vue-router named views
    namedViewsAsParallelRoutes: true,
    parallelPages: {
      left: {
        // this config is for demo in docs only
        // the index default value is '/~index' so usually you don't need to set it in your project
        index: '/examples/parallel-routes/~index',
      },
    },
  },
})
