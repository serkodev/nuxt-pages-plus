export default defineNuxtConfig({
  modules: ['../../../../src/module'],
  pagesPlus: {
    experimental: {
      parallelPageMetaKey: true,
    },
  },
})
