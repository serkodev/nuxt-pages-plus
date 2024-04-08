import type { InjectionKey } from 'vue'
import type { MaybeRef } from '#imports'

export const NamedRouterSymbol = Symbol('NamedRouterSymbol') as InjectionKey<MaybeRef<string> | undefined>

export const NamedRouteNotFoundSymbol = Symbol('NamedRouteNotFoundSymbol')
