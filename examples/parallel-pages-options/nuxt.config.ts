// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: '../base',
  pagesPlus: {
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
