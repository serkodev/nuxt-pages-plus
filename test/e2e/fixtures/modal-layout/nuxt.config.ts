// minimal fixture referencing examples/modal-layout, without ui/styling
export default defineNuxtConfig({
  modules: ['../../../../src/module'],
  pagesPlus: {
    namedViewsAsParallelRoutes: true,
    parallelPages: {
      modal: {
        sync: 'post',
      },
    },
  },
})
