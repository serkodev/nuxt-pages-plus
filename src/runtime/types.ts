export interface ParallelPageOptions {
  // default: true
  mode: 'sync' | 'manual' | 'sync-once'

  // default: undefined
  manualSyncIndexPath?: string

  // default: '/default'
  defaultPath: string | false

  // default: false
  skipNavigateIfNotFound: boolean
}

export interface PagesPlusParallelOptions {
  separator: string
  pages: Record<string, Partial<ParallelPageOptions>>
}

export interface PagesPlusOptions {
  parallel: Partial<PagesPlusParallelOptions> | false
}

export interface ParallelRoute {
  name: string
  path: string
}
