export interface ParallelPageOptions {
  // default: true
  sync: boolean | 'init'

  // default: '/'
  defaultPath: string

  // default: '/not-found'
  notFoundPath: string | false
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
