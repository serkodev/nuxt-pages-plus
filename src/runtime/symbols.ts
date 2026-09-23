import type { InjectionKey } from 'vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import type { MaybeRef, Ref } from '#imports'

export const ParallelRouterSymbol = Symbol('ParallelRouterSymbol') as InjectionKey<MaybeRef<string> | undefined>

// Each outlet supplies its own context, masking any outer route override.
export const ParallelRouteSymbol = Symbol('ParallelRouteSymbol') as InjectionKey<{
  route: Ref<RouteLocationNormalizedLoadedGeneric | undefined>
  isOverride: Ref<boolean>
} | undefined>

export const ParallelRouteNotFoundSymbol = Symbol('ParallelRouteNotFoundSymbol')
