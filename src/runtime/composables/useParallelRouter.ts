import type { RouteLocationNormalizedLoaded, RouteLocationNormalizedLoadedGeneric, Router } from 'vue-router'
import type { ParallelRouter } from '../parallel-router'
import { ParallelRouterSymbol } from '../symbols'
import { useNuxtApp, useRoute, useRouter } from '#app'
import { type Ref, inject, toRef, unref } from '#imports'

export function useParentRouterName(): Ref<string | undefined> {
  const symbol = inject(ParallelRouterSymbol, undefined)
  return toRef(symbol)
}

export function useParentRouter(): Router {
  return useParallelRouter() ?? useRouter()
}

export function useParentRoute(): RouteLocationNormalizedLoadedGeneric {
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
