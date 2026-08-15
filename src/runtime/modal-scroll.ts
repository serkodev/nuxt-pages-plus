import type { RouterScrollBehavior } from 'vue-router'

export function createModalScrollBehavior(
  scrollBehavior: RouterScrollBehavior,
  isModalNavigation: () => boolean,
): RouterScrollBehavior {
  return (to, from, savedPosition) => {
    if (isModalNavigation())
      return savedPosition ?? false

    return scrollBehavior(to, from, savedPosition)
  }
}
