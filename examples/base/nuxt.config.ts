import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['../base-utils'],
  modules: [
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
