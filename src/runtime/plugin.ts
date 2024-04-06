/* eslint-disable no-console */
import type { RouteRecord } from 'vue-router'
import { extractNamedRoutePath } from '../utils'
import { type NamedRouter, createNamedRouter } from './named-router'
import { defineNuxtPlugin, useRouter } from '#app'

export default defineNuxtPlugin(async () => {
  const router = useRouter()

  if (import.meta.dev && import.meta.client)
    console.log('global router (before)', router.getRoutes())

  const namedRoutes = router.getRoutes().reduce((acc, route) => {
    const namedRoutePath = extractNamedRoutePath(route.path)
    if (namedRoutePath) {
      ;(acc[namedRoutePath.name] ??= []).push({
        ...route,
        path: namedRoutePath.path,
      })

      // remove the named route from the global router
      if (route.name && router.hasRoute(route.name))
        router.removeRoute(route.name)
    }
    return acc
  }, {} as Record<string, RouteRecord[]>)

  if (import.meta.dev && import.meta.client)
    console.log('routerGroups', namedRoutes)

  // create named routers
  const namedRouters: Record<string, NamedRouter> = {}
  for (const [group, routes] of Object.entries(namedRoutes)) {
    const namedRouter = createNamedRouter(group, routes)
    namedRouters[group] = namedRouter

    // wait for loading the initial path
    await namedRouter.tryPush(router.currentRoute.value.path, '/')

    // sync named routers with the global router
    router.afterEach((to) => {
      namedRouter.tryPush(to.path)
    })

    if (import.meta.dev && import.meta.client)
      console.log(`namedRouter[${group}]`, namedRouter.getRoutes())
  }

  if (import.meta.dev && import.meta.client)
    console.log('global router (after)', router.getRoutes())

  return { provide: { namedRouters } }
})
