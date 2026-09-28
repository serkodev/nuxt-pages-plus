export default defineNuxtConfig({
  modules: ['../../../../src/module'],
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
