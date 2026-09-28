export default defineNuxtRouteMiddleware((to) => {
  // Exercise stackPaths' redirect sync: a modal push to /gallery/99 settles on
  // /gallery/6, so the stamped (requested) path differs from the final route.
  if (to.path === '/gallery/99')
    return navigateTo('/gallery/6')
})
