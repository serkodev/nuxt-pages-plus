import process from 'node:process'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  extends: [
    '@nuxt-themes/docus',
    resolve('../examples/base-utils'),
  ],
  devtools: { enabled: false },
  css: [
    resolve('./assets/main.css'),
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    resolve('../src/module'),
  ],

  // XXX: temp fix for SSR crash for content including table & code block when development
  ssr: process.env.NODE_ENV === 'production',
  nitro: {
    prerender: {
      ignore: [
        '/examples/',
      ],
    },
  },

  pagesPath: {
    basedPath: /examples\/[\w-]+\//,
  },

  pagesPlus: {
    parallelPages: {
      left: {
        // this config is for demo in docs only
        // the index default value is '/~index' so usually you don't need to set it in your project
        index: '/examples/parallel-routes/~index',
      },
    },
  },
})
