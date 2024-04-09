import type { ParallelRouter } from '../parallel-router'
import { ParallelRouterSymbol } from '../symbols'
import { useNuxtApp, useRouter } from '#app'
import { inject, unref } from '#imports'

export function useParentRouterName() {
  return inject(ParallelRouterSymbol, undefined)
}

export function useParentRouter() {
  return useParallelRouter() ?? useRouter()
}

export function useParentRoute() {
  return useParentRouter().currentRoute.value
}

export function useParallelRouters() {
  return useNuxtApp().$parallelRouters as Record<string, ParallelRouter>
}

export function useParallelRouter(name: string | undefined = unref(useParentRouterName())) {
  if (name)
    return useParallelRouters()?.[name]
}

// list all parallel routers that able to resolve input path
export function resolveParallelRoutersByPath(path: string) {
  return Object.values(useParallelRouters() ?? {}).filter(parallelRouter => parallelRouter.hasPath(path))
}
