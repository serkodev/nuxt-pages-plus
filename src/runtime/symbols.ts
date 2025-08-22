import type { MaybeRef } from '#imports'
import type { InjectionKey } from 'vue'

export const ParallelRouterSymbol = Symbol('ParallelRouterSymbol') as InjectionKey<MaybeRef<string> | undefined>

export const ParallelRouteNotFoundSymbol = Symbol('ParallelRouteNotFoundSymbol')
