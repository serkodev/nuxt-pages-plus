export interface ParallelPageOptions {
  // default: 'sync'
  mode: 'sync' | 'sync-once' | 'manual'

  // default: undefined
  manualSyncIndexPath?: string

  // default: '/~default'
  defaultPath: string | false

  // default: '/~not-found'
  notFoundPath: string | false

  // default: false
  disableSoftNavigation: boolean
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
