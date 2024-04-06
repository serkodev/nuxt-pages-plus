import type { InjectionKey } from 'vue'

export const NamedRouterSymbol = Symbol('NamedRouterSymbol') as InjectionKey<string>

export const NamedRouteNotFoundSymbol = Symbol('NamedRouteNotFoundSymbol')
