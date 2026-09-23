import type { InjectionKey } from 'vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import type { MaybeRef, Ref } from '#imports'

export const ParallelRouterSymbol = Symbol('ParallelRouterSymbol') as InjectionKey<MaybeRef<string> | undefined>

// the route ref a `<PlusParallelPage>` is currently rendering (its `route` prop,
// or the parallel router's current route) — provided so descendants read it via
// `useParentRoute()` instead of the parallel router's shared current (top) route.
export const ParallelRouteSymbol = Symbol('ParallelRouteSymbol') as InjectionKey<Ref<RouteLocationNormalizedLoadedGeneric | undefined> | undefined>

export const ParallelRouteNotFoundSymbol = Symbol('ParallelRouteNotFoundSymbol')
