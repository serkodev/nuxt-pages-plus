// minimal fixture referencing docs/pages/examples/modal-routes, without ui/styling
export default defineNuxtConfig({
  modules: ['../../../../src/module'],
  pagesPlus: {
    namedViewsAsParallelRoutes: true,
  },
})
