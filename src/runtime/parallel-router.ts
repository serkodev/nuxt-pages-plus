/* eslint-disable no-console */
import type { RouteLocationNormalizedLoaded, RouteLocationRaw, RouteLocationResolved, Router, RouteRecord } from 'vue-router'
import type { Ref } from '#imports'
import type { PagesPlusOptions, ParallelPageOptions } from './types'
import { defu } from 'defu'
import { createMemoryHistory, createRouter } from 'vue-router'
import { defineNuxtPlugin, useRouter } from '#app'
import pagesPlusOptions from '#build/nuxt-pages-plus-options.mjs'
import { reactive } from '#imports'
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

// reactive object that always reflects the ref's current value,
// so a parallel route can be consumed like `useRoute()` without unwrapping `.value`
// (equivalent to `toReactive` from `@vueuse/core`, inlined to avoid the dependency)
function toReactive<T extends object>(objectRef: Ref<T>): T {
  const proxy = new Proxy({} as T, {
    get: (_, p, receiver) => Reflect.get(objectRef.value, p, receiver),
    set: (_, p, value) => Reflect.set(objectRef.value, p, value),
    deleteProperty: (_, p) => Reflect.deleteProperty(objectRef.value, p),
    has: (_, p) => Reflect.has(objectRef.value, p),
    ownKeys: () => Object.keys(objectRef.value),
    getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
  })
  return reactive(proxy) as T
}

export default defineNuxtPlugin(async (nuxt) => {
  const router = useRouter()

  // Navigating during hydration patches a half-hydrated tree, freezing the old page on
  // screen (or rolling the navigation back) — hold popstate navigations until it settles.
  if (import.meta.client) {
    // `app:beforeMount` fires after the boot `router.replace` in the `app:created` hook
    // below, so boot navigations can never be held
    nuxt.hooks.hookOnce('app:beforeMount', () => {
      // without server rendering there is nothing to hydrate
      if (!nuxt.payload.serverRendered || !nuxt.isHydrating)
        return

      // the pending popstate destination — matched by target path so an aborted
      // popstate (or a concurrent programmatic push) cannot leak the hold
      let popstateTarget: string | undefined

      // a redirected popstate is re-issued as a programmatic navigation to another
      // path; `redirectedFrom` still carries the original destination, so match it too
      function matchesPopstate(to: { fullPath: string, redirectedFrom?: { fullPath: string } }) {
        return popstateTarget !== undefined
          && (to.fullPath === popstateTarget || to.redirectedFrom?.fullPath === popstateTarget)
      }

      const stops: Array<() => void> = []

      const hydrated = new Promise<void>((resolve) => {
        function done() {
          popstateTarget = undefined
          for (const stop of stops) {
            stop()
          }

          resolve()
        }
        stops.push(
          nuxt.hooks.hookOnce('app:suspense:resolve', done),
          // hydration may never settle after a fatal error — release the hold
          // rather than leaving the back/forward buttons dead
          nuxt.hooks.hookOnce('app:error', done),
        )
      })

      stops.push(
        // `history.listen` fires synchronously inside vue-router's popstate handler,
        // before the navigation's guards — a window `popstate` listener would be too late
        router.options.history.listen((to) => {
          popstateTarget = to
        }),
        // clear the mark once a matching navigation finishes or fails, so an aborted
        // popstate cannot leak its hold onto a later navigation
        router.afterEach((to) => {
          if (matchesPopstate(to)) {
            popstateTarget = undefined
          }
        }),
        router.onError((_error, to) => {
          if (matchesPopstate(to)) {
            popstateTarget = undefined
          }
        }),
        // only popstate navigations are held: a programmatic one awaited inside a
        // hydrating setup (e.g. `await navigateTo()`) would deadlock its own suspense.
        // (`_processingMiddleware` stays set while held, so a concurrent `navigateTo()`
        // is a no-op — the held back/forward press is the user's latest intent and wins)
        router.beforeEach(async (to) => {
          if (!matchesPopstate(to))
            return

          popstateTarget = undefined
          await hydrated
        }),
      )
    })
  }

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
    _parallelRoutes[group] = toReactive(parallelRouter.currentRoute)

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
    sync: 'pre',
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

  function resolvePath(route: string | RouteLocationRaw): RouteLocationResolved | undefined {
    const path = typeof route === 'string' ? route : route.path
    if (path === undefined)
      return undefined

    const resolved = parallelRouter.resolve(path)
    if (resolved.name === ParallelRouteNotFoundSymbol)
      return undefined

    return resolved
  }

  function hasPath(route: string | RouteLocationRaw) {
    return resolvePath(route) !== undefined
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
    if (options.sync === 'pre' && options.mode === 'sync')
      await tryPush(to)
  })

  router.afterEach((to) => {
    if (options.sync === 'post' && options.mode === 'sync')
      tryPush(to)
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
