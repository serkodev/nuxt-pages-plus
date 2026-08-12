import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    resolve('../../src/module'),
    '@nuxt/ui',
  ],
  devtools: { enabled: true },
  css: [
    resolve('./assets/main.css'),
  ],
  typescript: {
    typeCheck: 'build',
  },
})
