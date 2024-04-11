export interface ParallelPageOptions {
  // default: true
  mode: 'sync' | 'sync-once' | 'manual'

  // default: undefined
  manualSyncIndexPath?: string

  // default: '/default'
  defaultPath: string | false

  // default: '/not-found'
  notFoundPath: string | false

  // default: false
  disableSoftNavigation: boolean
}

export interface PagesPlusOptions {
  parallel: Partial<PagesPlusParallelOptions> | false
}

export interface ParallelRoute {
  name: string
  path: string
}
