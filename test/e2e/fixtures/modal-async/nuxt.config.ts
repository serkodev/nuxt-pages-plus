// modal-routes fixture variant whose standalone gallery page has an async
// setup delay, keeping the previous page (and its modal outlet) on screen
// while the navigation is pending
export default defineNuxtConfig({
  modules: ['../../../../src/module'],
  pagesPlus: {
    namedViewsAsParallelRoutes: true,
  },
})
