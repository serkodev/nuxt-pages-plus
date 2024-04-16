export interface ParallelPageOptions {
  // default: 'sync'
  mode: 'sync' | 'sync-once' | 'manual'

  // default: undefined
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

export interface ParallelPagePageMeta {
  ignore?: boolean
  name?: string
  path?: string
}
