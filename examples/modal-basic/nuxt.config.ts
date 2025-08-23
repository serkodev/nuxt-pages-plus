// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: '../base',
  pagesPlus: {
    parallelPages: {
      modal: {
        sync: 'post',
      },
    },
  },
})
