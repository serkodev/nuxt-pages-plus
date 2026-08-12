// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-pages-plus'],

  // exercise the full module options type surface
  pagesPlus: {
    separator: '@',
    namedViewsAsParallelRoutes: true,
    parallelPages: {
      side: {
        mode: 'sync',
        sync: 'pre',
        index: '/~index',
        fallback: true,
      },
      modal: {
        sync: 'post',
        fallback: { redirect: '/' },
      },
    },
  },
})
