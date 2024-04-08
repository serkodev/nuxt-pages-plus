import type { InjectionKey } from 'vue'
import type { MaybeRef } from '#imports'

export const ParallelRouterSymbol = Symbol('ParallelRouterSymbol') as InjectionKey<MaybeRef<string> | undefined>

export const ParallelRouteNotFoundSymbol = Symbol('ParallelRouteNotFoundSymbol')
