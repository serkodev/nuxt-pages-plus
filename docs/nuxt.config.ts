import process from 'node:process'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  extends: [
    '@nuxt-themes/docus',
    resolve('../examples/base-utils'),
  ],
  devtools: { enabled: true },
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
})
