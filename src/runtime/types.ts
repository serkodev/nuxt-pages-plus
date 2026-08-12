export interface ParallelPageOptions {
  // default: 'sync'
  mode: 'sync' | 'sync-once' | 'manual'

  // default: 'pre'
  sync: 'pre' | 'post'

  // default: '/~index'
  index?: string

  // default: true
  fallback: boolean | {
    redirect?: string
  }
}

export interface PagesPlusOptions {
  separator: string
  parallelPages: Record<string, Partial<ParallelPageOptions>>

  /**
   * Nuxt >= 4.5 parses `name@view.vue` page files as vue-router named views
   * instead of emitting standalone `/name@view` routes. Enable this option to
   * keep treating them as parallel routes, like older Nuxt versions did.
   *
   * Only effective on Nuxt >= 4.5 with the default `@` separator: older Nuxt
   * versions always emit such files as parallel routes, regardless of this
   * option.
   *
   * @default false
   */
  namedViewsAsParallelRoutes?: boolean

  experimental?: {
    parallelPageMetaKey?: boolean
  }
}

export interface ParallelRoute {
  name: string
  path: string
}
