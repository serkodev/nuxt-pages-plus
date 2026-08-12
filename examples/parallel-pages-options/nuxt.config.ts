// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: '../base',
  pagesPlus: {
    namedViewsAsParallelRoutes: true,
    parallelPages: {
      left: {
        index: '/foo',
      },
      right: {
        fallback: {
          redirect: '/not-found',
        },
      },
    },
  },
})
