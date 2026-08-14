// lets tests abort a navigation like an unsaved-changes confirm guard would
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.client && (window as any).__blockLeave)
    return false
})
