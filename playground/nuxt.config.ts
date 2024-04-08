// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: '../examples/base',
  namedPages: {
    pages: {
      left: {
        sync: false,
        defaultPath: '/foo',
      },
      right: {
        defaultPath: '/my-default',
      },
    },
  },
})
