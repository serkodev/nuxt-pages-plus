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
  experimental?: {
    parallelPageMetaKey?: boolean
  }
}

export interface ParallelRoute {
  name: string
  path: string
}
