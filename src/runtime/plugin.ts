/* eslint-disable no-console */
import type { RouteRecord } from 'vue-router'
import { extractNamedRoutePath } from '../utils'
import type { NamedPagesOptions } from '../types'
import { type NamedRouter, createNamedRouter } from './named-router'
import { defineNuxtPlugin, useRouter } from '#app'

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import namedPagesConfig from '#build/named-pages-config.mjs'

interface NamedPagesPageMeta {
  ignore?: boolean
}

const DEBUG = import.meta.dev && import.meta.client && import.meta.env.VITE_NAMED_PAGES_DEBUG

export default defineNuxtPlugin(async () => {
  const router = useRouter()

  const { separator, pages } = namedPagesConfig as NamedPagesOptions

  if (DEBUG)
    console.log('global router (before)', router.getRoutes())

  const namedRoutes = router.getRoutes().reduce((acc, route) => {
    if ((route.meta as { namedPages?: NamedPagesPageMeta })?.namedPages?.ignore)
      return acc

    const namedRoutePath = extractNamedRoutePath(route.path, separator)
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

  if (DEBUG)
    console.log('routerGroups', namedRoutes)

  // create named routers
  const namedRouters: Record<string, NamedRouter> = {}
  for (const [group, routes] of Object.entries(namedRoutes)) {
    const namedRouter = await createNamedRouter(group, routes, router, pages[group] ?? {})
    namedRouters[group] = namedRouter

    if (DEBUG)
      console.log(`namedRouter[${group}]`, namedRouter.getRoutes())
  }

  if (DEBUG)
    console.log('global router (after)', router.getRoutes())

  return { provide: { namedRouters } }
})
