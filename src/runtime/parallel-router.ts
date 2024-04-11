/* eslint-disable no-console */
import { createMemoryHistory, createRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecord, Router } from 'vue-router'
import { defu } from 'defu'
import { reactiveComputed } from '@vueuse/core'
import type { PagesPlusParallelOptions, ParallelPageOptions } from './types'
import { ParallelRouteNotFoundSymbol } from './symbols'
import { extractParallelRoutePath, overrideRoutePath } from './utils'
import { defineNuxtPlugin, useRouter } from '#app'
import parallelPagesConfig from '#build/parallel-pages-config.mjs'
import { type Ref, ref } from '#imports'

export interface ParallelRouter extends Router {
  name?: string
  inSoftNavigation: Ref<boolean>
  hasPath: (path: string) => boolean
  tryPush: (path: string, defaultPath?: ParallelPageOptions['defaultPath']) => ReturnType<Router['push']> | undefined
  sync: (defaultPath?: ParallelPageOptions['defaultPath']) => ReturnType<Router['push']> | undefined
  setSync: (sync: boolean) => void
}

interface ParallelPagePageMeta {
  ignore?: boolean
  name?: string
  path?: string
}

const DEBUG = import.meta.dev && import.meta.client && import.meta.env.VITE_PAGES_PLUS_DEBUG

export default defineNuxtPlugin(async () => {
  const router = useRouter()

  const { separator, pages } = parallelPagesConfig as unknown as PagesPlusParallelOptions

  if (DEBUG)
    console.log('global router (before)', router.getRoutes())

  const parallelRoutes = router.getRoutes().reduce((acc, route) => {
    const parallelPageMeta = (route.meta as { parallel?: ParallelPagePageMeta }).parallel ?? {}
    if (parallelPageMeta.ignore)
      return acc

    const parallelRoutePath = overrideRoutePath(
      extractParallelRoutePath(route.path, separator),
      {
        name: parallelPageMeta.name,
        path: parallelPageMeta.path,
      },
    )

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

  // create parallel routers and routes
  const parallelRouters: Record<string, ParallelRouter> = {}
  const _parallelRoutes: Record<string, RouteLocationNormalizedLoaded> = {}
  for (const [group, routes] of Object.entries(parallelRoutes)) {
    const parallelRouter = await createParallelRouter(group, routes, router, pages[group] ?? {})
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
    defaultPath: '/default',
    disableSoftNavigation: false,
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

  function hasPath(path: string) {
    return parallelRouter.resolve(path)?.name !== ParallelRouteNotFoundSymbol
  }

  const inSoftNavigation = ref(false)

  // try to push the path, if not found, try to push the not found path
  function tryPush(path: string, defaultPath: ParallelPageOptions['defaultPath'] = options.defaultPath) {
    async function pushWithFallback(path: string, ...fallbacks: (string | undefined)[]) {
      for (const _path of [path, ...fallbacks])
        if (_path !== undefined && (options.disableSoftNavigation || hasPath(_path))) {
          const result = await parallelRouter.push(_path)

          // set state after the navigation is done
          inSoftNavigation.value = false
          return result
        }
      inSoftNavigation.value = true
    }
    return pushWithFallback(path, defaultPath || undefined)
  }

  // sync the parallel router with the global router
  function sync() {
    return tryPush(router.currentRoute.value.path)
  }

  function setSync(sync: boolean) {
    options.mode = sync ? 'sync' : 'manual'
  }

  // initialize sync. if unable to resolve the sync path or if sync is disabled, push the default path.
  if (options.mode === 'manual') {
    if (options.manualSyncIndexPath)
      await tryPush(options.manualSyncIndexPath)
  } else {
    await sync()
  }

  // sync parallel routers with the global router
  router.beforeResolve(async (to) => {
    if (options.mode === 'sync')
      await tryPush(to.path)
  })

  return {
    ...parallelRouter,
    name,
    inSoftNavigation,
    hasPath,
    tryPush,
    sync,
    setSync,
  }
}
