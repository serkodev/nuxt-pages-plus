import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '../../src/module',
  ],
  devtools: { enabled: true },
  css: [
    resolve('./assets/main.css'),
  ],
})
