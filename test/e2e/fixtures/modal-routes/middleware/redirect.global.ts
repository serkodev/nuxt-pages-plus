export default defineNuxtRouteMiddleware((to) => {
  // a modal navigation to /gallery/99 settles on /gallery/6, so stackPaths must
  // follow the final route rather than the requested one
  if (to.path === '/gallery/99')
    return navigateTo('/gallery/6')
})
