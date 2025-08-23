/* eslint-disable no-console */
import type { RouteLocationNormalizedLoaded, RouteLocationRaw, Router, RouteRecord } from 'vue-router'
import type { PagesPlusOptions, ParallelPageOptions } from './types'
import { defineNuxtPlugin, useRouter } from '#app'
import pagesPlusOptions from '#build/nuxt-pages-plus-options.mjs'
import { reactive } from '#imports'
import { reactiveComputed } from '@vueuse/core'
import { defu } from 'defu'
import { createMemoryHistory, createRouter } from 'vue-router'
import { ParallelRouteNotFoundSymbol } from './symbols'
import { extractParallelRoutePath } from './utils'

export interface ParallelRouter extends Router {
  name?: string
  fallback: {
    notFound: boolean
    index: boolean
  }
  hasPath: (path: string | RouteLocationRaw) => boolean
  tryPush: (route: RouteLocationRaw, fallbackRedirect?: string) => ReturnType<Router['push']> | undefined
  sync: () => ReturnType<Router['push']> | undefined
  setSync: (sync: boolean) => void
}

const DEBUG = false

export default defineNuxtPlugin(async () => {
  const router = useRouter()

  const { separator, parallelPages: pagesOptions } = pagesPlusOptions as unknown as PagesPlusOptions

  if (DEBUG)
    console.log('global router (before)', router.getRoutes())

  const parallelRoutes = router.getRoutes().reduce((acc, route) => {
    const parallelRoutePath = extractParallelRoutePath(route.path, separator)

    if (parallelRoutePath) {
      ; (acc[parallelRoutePath.name] ??= []).push({
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

  // create parallel routers and routes
  const parallelRouters: Record<string, ParallelRouter> = {}
  const _parallelRoutes: Record<string, RouteLocationNormalizedLoaded> = {}
  for (const [group, routes] of Object.entries(parallelRoutes)) {
    const parallelRouter = await createParallelRouter(group, routes, router, pagesOptions[group] ?? {})
    parallelRouters[group] = parallelRouter
    _parallelRoutes[group] = reactiveComputed(() => parallelRouter.currentRoute.value)

    if (DEBUG)
      console.log(`parallelRouter[${group}]`, parallelRouter.getRoutes())
  }

  if (DEBUG)
    console.log('global router (after)', router.getRoutes())

  return {
    provide: {
      parallelRouters,
      parallelRoutes: _parallelRoutes,
    },
  }
})

async function createParallelRouter(name: string, routes: RouteRecord[], router: Router, parallelPageOptions: Partial<ParallelPageOptions>): Promise<ParallelRouter> {
  const options = defu(parallelPageOptions, {
    mode: 'sync',
    index: '/~index',
    fallback: true,
  } satisfies ParallelPageOptions)

  const parallelRouter = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  // add a not-found route to detect not found routes
  // to prevent "No match found for location with path" console warning from vue-router
  parallelRouter.addRoute({
    path: '/:all(.*)*',
    name: ParallelRouteNotFoundSymbol,
    component: { render: () => undefined },
  })

  function hasPath(route: string | RouteLocationRaw) {
    const path = typeof route === 'string' ? route : route.path
    return path === undefined ? false : parallelRouter.resolve(path)?.name !== ParallelRouteNotFoundSymbol
  }

  const fallback = reactive({
    notFound: false,
    index: false,
  })

  // try to push the path, if not found, try to push the not found path
  function tryPush(route: RouteLocationRaw, fallbackRedirect = typeof options.fallback === 'object' && options.fallback.redirect) {
    const normalizedRoute = typeof route === 'string'
      ? route
      : {
        path: route.path,
        query: route.query,
        hash: route.hash,
      } satisfies RouteLocationRaw

    function pushWithFallback(route: RouteLocationRaw, ...fallbacks: (string | undefined)[]) {
      if (options.fallback === false || hasPath(route))
        return parallelRouter.push(route)

      for (const _path of fallbacks) {
        if (_path !== undefined)
          return parallelRouter.push(_path)
      }
    }

    const push = pushWithFallback(normalizedRoute, fallbackRedirect || undefined)
    if (push) {
      return push.then(() => {
        Object.assign(fallback, {
          notFound: false,
          index: false,
        })
      })
    } else {
      fallback.notFound = true
    }
  }

  // sync the parallel router with the global router
  function sync() {
    return tryPush(router.currentRoute.value)
  }

  function setSync(sync: boolean) {
    options.mode = sync ? 'sync' : 'manual'
  }

  async function init() {
    async function tryIndex() {
      const pushIndex = options.index && tryPush(options.index)
      if (pushIndex) {
        await pushIndex
      } else {
        fallback.index = true
      }
    }

    if (options.mode === 'manual') {
      await tryIndex()
    } else {
      const initSync = sync()
      if (initSync) {
        await initSync
      } else {
        await tryIndex()
      }
    }
  }

  await init()

  // sync parallel routers with the global router
  router.beforeResolve(async (to) => {
    if (options.mode === 'sync')
      await tryPush(to)
  })

  return {
    ...parallelRouter,
    name,
    fallback,
    hasPath,
    tryPush,
    sync,
    setSync,
  }
}
