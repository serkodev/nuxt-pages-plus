export interface ParallelPageOptions {
  // default: 'sync'
  mode: 'sync' | 'sync-once' | 'manual'

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
}

export interface ParallelRoute {
  name: string
  path: string
}
