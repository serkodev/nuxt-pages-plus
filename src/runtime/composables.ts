import type { NamedRouter } from './named-router'
import { NamedRouterSymbol } from './symbols'
import { useNuxtApp, useRouter } from '#app'
import { inject, unref } from '#imports'

export function useParentRouterName() {
  return inject(NamedRouterSymbol, undefined)
}

export function useParentRouter() {
  return useNamedRouter() ?? useRouter()
}

export function useParentRoute() {
  return useParentRouter().currentRoute.value
}

export function useNamedRouters() {
  return useNuxtApp()?.$namedRouters as Record<string, NamedRouter> | undefined
}

export function useNamedRouter(name: string | undefined = unref(useParentRouterName())) {
  if (name)
    return useNamedRouters()?.[name]
}

// list all named routers that able to resolve input path
export function resolveNamedRoutersByPath(path: string) {
  return Object.values(useNamedRouters() ?? {}).filter(namedRouter => namedRouter.hasPath(path))
}
