export interface NamedPageOptions {
  // default: true
  sync: boolean | 'init'

  // default: '/'
  defaultPath: string

  // default: '/not-found'
  notFoundPath: string | false
}

export interface NamedPagesOptions {
  separator: string
  pages: Record<string, Partial<NamedPageOptions>>
}
