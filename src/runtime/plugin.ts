/* eslint-disable no-console */
import type { RouteRecord } from 'vue-router'
import { extractParallelRoutePath } from './utils'
import type { PagesPlusParallelOptions } from './types'
import { type ParallelRouter, createParallelRouter } from './parallel-router'
import { defineNuxtPlugin, useRouter } from '#app'
import parallelPagesConfig from '#build/parallel-pages-config.mjs'

interface ParallelPagePageMeta {
  ignore?: boolean
}

const DEBUG = import.meta.dev && import.meta.client && import.meta.env.VITE_PAGES_PLUS_DEBUG

export default defineNuxtPlugin(async () => {
  const router = useRouter()

  const { separator, pages } = parallelPagesConfig as unknown as PagesPlusParallelOptions

  if (DEBUG)
    console.log('global router (before)', router.getRoutes())

  const parallelRoutes = router.getRoutes().reduce((acc, route) => {
    if ((route.meta as { parallel?: ParallelPagePageMeta })?.parallel?.ignore)
      return acc

    const parallelRoutePath = extractParallelRoutePath(route.path, separator)
    if (parallelRoutePath) {
      ;(acc[parallelRoutePath.name] ??= []).push({
        ...route,
        path: parallelRoutePath.path,
      })

      // remove the parallel route from the global router
      if (route.name && router.hasRoute(route.name))
        router.removeRoute(route.name)
    }
    return acc
  }, {} as Record<string, RouteRecord[]>)

  if (DEBUG)
    console.log('parallelRoutes', parallelRoutes)

  // create parallel routers
  const parallelRouters: Record<string, ParallelRouter> = {}
  for (const [group, routes] of Object.entries(parallelRoutes)) {
    const parallelRouter = await createParallelRouter(group, routes, router, pages[group] ?? {})
    parallelRouters[group] = parallelRouter

    if (DEBUG)
      console.log(`parallelRouter[${group}]`, parallelRouter.getRoutes())
  }

  if (DEBUG)
    console.log('global router (after)', router.getRoutes())

  return { provide: { parallelRouters } }
})
