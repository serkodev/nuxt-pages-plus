import type { RouteLocationNormalizedLoaded, RouteLocationNormalizedLoadedGeneric, Router } from 'vue-router'
import type { Ref } from '#imports'
import type { ParallelRouter } from '../parallel-router'
import { useNuxtApp, useRoute, useRouter } from '#app'
import { inject, reactive, toRef, unref } from '#imports'
import { ParallelRouterSymbol, ParallelRouteSymbol } from '../symbols'

// reactive object that always reflects the ref's current value, so a parallel
// route can be consumed like `useRoute()` without unwrapping `.value`
// (equivalent to `toReactive` from `@vueuse/core`, inlined to avoid the dependency;
// mirrors the same helper in parallel-router.ts)
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

export function useParentRouterName(): Ref<string | undefined> {
  const symbol = inject(ParallelRouterSymbol, undefined)
  return toRef(symbol)
}

export function useParentRouter(): Router {
  return useParallelRouter() ?? useRouter()
}

export function useParentRoute(): RouteLocationNormalizedLoadedGeneric {
  // a <PlusParallelPage> provides the route it is rendering; prefer that so a page
  // rendered with an explicit `route` prop reads ITS params, not the parallel
  // router's shared current (top) route
  const parallelRoute = inject(ParallelRouteSymbol, undefined)
  if (parallelRoute)
    return toReactive(parallelRoute as Ref<RouteLocationNormalizedLoadedGeneric>)
  return useParallelRoute() ?? useRoute()
}

export function useParallelRouters() {
  return useNuxtApp().$parallelRouters as Record<string, ParallelRouter>
}

export function useParallelRoutes() {
  return useNuxtApp().$parallelRoutes as Record<string, RouteLocationNormalizedLoaded>
}

export function useParallelRouter(name: string | undefined = unref(useParentRouterName())) {
  if (name)
    return useParallelRouters()?.[name]
}

export function useParallelRoute(name: string | undefined = unref(useParentRouterName())) {
  if (name)
    return useParallelRoutes()?.[name]
}

// list all parallel routers that able to resolve input path
export function resolveParallelRoutersByPath(path: string) {
  return Object.values(useParallelRouters() ?? {}).filter(parallelRouter => parallelRouter.hasPath(path))
}
