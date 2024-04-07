export interface NamedPageOptions {
  sync: boolean | 'init'
  defaultPath: string // '/'
  notFoundPath: string | boolean // false
}

export interface NamedPagesOptions {
  separator: string
  pages: Record<string, Partial<NamedPageOptions>>
}
