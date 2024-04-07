// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: '../examples/base',
  namedPages: {
    pages: {
      left: {
        // defaultPath: '/default', // rename to default@left.vue
        sync: false,
      },
    },
  },
})
