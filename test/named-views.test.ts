import type { NuxtPage } from '@nuxt/schema'
import { describe, expect, it, vi } from 'vitest'
import { restoreParallelPages } from '../src/named-views'

// page inputs mirror what Nuxt >= 4.5 (unrouting) emits for the given file
// layouts, captured from `toVueRouter4` with Nuxt's own tree options.
// expected outputs are the routes Nuxt < 4.5 emitted for the same files.

const ENABLED = { separator: '@', namedViewsAsParallelRoutes: true }

describe('config gating', () => {
  // pages/info.vue + pages/info@modal.vue
  function mergedPages(): NuxtPage[] {
    return [
      {
        path: '/info',
        file: 'pages/info.vue',
        children: [],
        name: 'info',
        components: { default: 'pages/info.vue', modal: 'pages/info@modal.vue' },
      },
    ]
  }

  it('does nothing and warns when the option is unset and named views exist', () => {
    const pages = mergedPages()
    const warn = vi.fn()
    restoreParallelPages(pages, { separator: '@' }, warn)

    expect(pages).toEqual(mergedPages())
    expect(warn).toHaveBeenCalledOnce()
  })

  it('does not warn when the option is unset and no named views exist', () => {
    const pages: NuxtPage[] = [{ path: '/info', file: 'pages/info.vue', children: [], name: 'info' }]
    const warn = vi.fn()
    restoreParallelPages(pages, { separator: '@' }, warn)

    expect(warn).not.toHaveBeenCalled()
  })

  it('does nothing and stays silent when the option is explicitly disabled', () => {
    const pages = mergedPages()
    const warn = vi.fn()
    restoreParallelPages(pages, { separator: '@', namedViewsAsParallelRoutes: false }, warn)

    expect(pages).toEqual(mergedPages())
    expect(warn).not.toHaveBeenCalled()
  })

  it('does nothing with a custom separator, leaving named views to Nuxt', () => {
    const pages = mergedPages()
    const warn = vi.fn()
    restoreParallelPages(pages, { separator: '+', namedViewsAsParallelRoutes: true }, warn)

    expect(pages).toEqual(mergedPages())
    expect(warn).not.toHaveBeenCalled()
  })

  it('is a no-op when pages carry no named views (Nuxt < 4.5)', () => {
    const pages: NuxtPage[] = [
      { path: '/info@modal', file: 'pages/info@modal.vue', children: [], name: 'info@modal' },
      { path: '/@left', file: 'pages/@left/index.vue', children: [], name: '@left' },
    ]
    restoreParallelPages(pages, ENABLED)

    expect(pages).toEqual([
      { path: '/info@modal', file: 'pages/info@modal.vue', children: [], name: 'info@modal' },
      { path: '/@left', file: 'pages/@left/index.vue', children: [], name: '@left' },
    ])
  })
})

describe('restore named views as parallel routes', () => {
  it('splits a named view back into a standalone literal route', () => {
    // pages/info.vue + pages/info@modal.vue
    const pages: NuxtPage[] = [
      {
        path: '/info',
        file: 'pages/info.vue',
        children: [],
        name: 'info',
        components: { default: 'pages/info.vue', modal: 'pages/info@modal.vue' },
      },
    ]
    restoreParallelPages(pages, ENABLED)

    expect(pages).toEqual([
      { path: '/info', file: 'pages/info.vue', children: [], name: 'info' },
      { path: '/info@modal', file: 'pages/info@modal.vue' },
    ])
  })

  it('rebuilds dynamic params in the restored path', () => {
    // pages/gallery/[id].vue + pages/gallery/[id]@modal.vue
    const pages: NuxtPage[] = [
      {
        path: '/gallery/:id()',
        file: 'pages/gallery/[id].vue',
        children: [],
        name: 'gallery-id',
        components: { default: 'pages/gallery/[id].vue', modal: 'pages/gallery/[id]@modal.vue' },
      },
    ]
    restoreParallelPages(pages, ENABLED)

    expect(pages).toEqual([
      { path: '/gallery/:id()', file: 'pages/gallery/[id].vue', children: [], name: 'gallery-id' },
      { path: '/gallery/:id()@modal', file: 'pages/gallery/[id]@modal.vue' },
    ])
  })

  it('restores multi-separator nested names from the file name', () => {
    // pages/index.vue + pages/index@foo.vue + pages/index@foo@bar.vue
    // the parser strips only the first `@chunk`, corrupting the merged path
    const pages: NuxtPage[] = [
      {
        path: '/index@bar',
        file: 'pages/index@foo@bar.vue',
        children: [],
        name: 'index@bar',
        components: { default: 'pages/index@foo@bar.vue', bar: 'pages/index@foo@bar.vue' },
      },
      {
        path: '/',
        file: 'pages/index.vue',
        children: [],
        name: 'index',
        components: { default: 'pages/index.vue', foo: 'pages/index@foo.vue' },
      },
    ]
    restoreParallelPages(pages, ENABLED)

    expect(pages).toEqual([
      { path: '/', file: 'pages/index.vue', children: [], name: 'index' },
      { path: '/index@foo@bar', file: 'pages/index@foo@bar.vue' },
      { path: '/index@foo', file: 'pages/index@foo.vue' },
    ])
  })

  it('drops the fabricated host route of a view file without a plain sibling', () => {
    // pages/foo@left.vue (no pages/foo.vue)
    const pages: NuxtPage[] = [
      {
        path: '/foo',
        file: 'pages/foo@left.vue',
        children: [],
        name: 'foo',
        components: { default: 'pages/foo@left.vue', left: 'pages/foo@left.vue' },
      },
    ]
    restoreParallelPages(pages, ENABLED)

    expect(pages).toEqual([
      { path: '/foo@left', file: 'pages/foo@left.vue' },
    ])
  })

  it('keeps directory segments when an index stem collapses into the path', () => {
    // pages/settings/index.vue + pages/settings/index@modal.vue
    const pages: NuxtPage[] = [
      {
        path: '/settings',
        file: 'pages/settings/index.vue',
        children: [],
        name: 'settings',
        components: { default: 'pages/settings/index.vue', modal: 'pages/settings/index@modal.vue' },
      },
    ]
    restoreParallelPages(pages, ENABLED)

    expect(pages).toEqual([
      { path: '/settings', file: 'pages/settings/index.vue', children: [], name: 'settings' },
      { path: '/settings/index@modal', file: 'pages/settings/index@modal.vue' },
    ])
  })

  it('hoists children of a dropped fabricated host to standalone routes', () => {
    // pages/foo@modal.vue + pages/foo/bar.vue (no pages/foo.vue)
    const pages: NuxtPage[] = [
      {
        path: '/foo',
        file: 'pages/foo@modal.vue',
        children: [
          { path: 'bar', file: 'pages/foo/bar.vue', children: [], name: 'foo-bar' },
        ],
        name: 'foo',
        components: { default: 'pages/foo@modal.vue', modal: 'pages/foo@modal.vue' },
      },
    ]
    restoreParallelPages(pages, ENABLED)

    expect(pages).toEqual([
      { path: '/foo@modal', file: 'pages/foo@modal.vue' },
      { path: '/foo/bar', file: 'pages/foo/bar.vue', children: [], name: 'foo-bar' },
    ])
  })

  it('moves a `.client`/`.server` mode to the restored route', () => {
    // pages/foo.vue + pages/foo@modal.client.vue
    // the named-view merge unions the view file's mode onto the host route
    const pages: NuxtPage[] = [
      {
        path: '/foo',
        file: 'pages/foo.vue',
        children: [],
        name: 'foo',
        components: { default: 'pages/foo.vue', modal: 'pages/foo@modal.client.vue' },
        mode: 'client',
      },
    ]
    restoreParallelPages(pages, ENABLED)

    expect(pages).toEqual([
      { path: '/foo', file: 'pages/foo.vue', children: [], name: 'foo' },
      { path: '/foo@modal', file: 'pages/foo@modal.client.vue', mode: 'client' },
    ])
  })

  it('encodes static path characters like Nuxt does', () => {
    // pages/foo bar.vue + pages/foo bar@modal.vue
    const pages: NuxtPage[] = [
      {
        path: '/foo%20bar',
        file: 'pages/foo bar.vue',
        children: [],
        name: 'foo bar',
        components: { default: 'pages/foo bar.vue', modal: 'pages/foo bar@modal.vue' },
      },
    ]
    restoreParallelPages(pages, ENABLED)

    expect(pages).toEqual([
      { path: '/foo%20bar', file: 'pages/foo bar.vue', children: [], name: 'foo bar' },
      { path: '/foo%20bar@modal', file: 'pages/foo bar@modal.vue' },
    ])
  })

  it('rebuilds directory segments containing the separator from the file path', () => {
    // pages/about@foo/us@bar.vue: the parser strips the directory's `@foo`
    // chunk, so the merged path is `/about/us@bar`
    const pages: NuxtPage[] = [
      {
        path: '/about/us@bar',
        file: 'pages/about@foo/us@bar.vue',
        children: [],
        name: 'about-us@bar',
        components: { default: 'pages/about@foo/us@bar.vue', bar: 'pages/about@foo/us@bar.vue' },
      },
    ]
    restoreParallelPages(pages, ENABLED)

    expect(pages).toEqual([
      { path: '/about@foo/us@bar', file: 'pages/about@foo/us@bar.vue' },
    ])
  })

  it('keeps page fields extracted for a fabricated host on the restored route', () => {
    // with `experimental.scanPageMeta: true`, Nuxt augments routes from
    // definePageMeta before pages:extend runs
    const pages: NuxtPage[] = [
      {
        path: '/foo',
        file: 'pages/foo@left.vue',
        children: [],
        name: 'foo',
        components: { default: 'pages/foo@left.vue', left: 'pages/foo@left.vue' },
        meta: { middleware: 'auth' },
      },
    ]
    restoreParallelPages(pages, ENABLED)

    expect(pages).toEqual([
      { path: '/foo@left', file: 'pages/foo@left.vue', meta: { middleware: 'auth' } },
    ])
  })

  it('restores named views merged into nested child routes', () => {
    // pages/parent.vue + pages/parent/child.vue + pages/parent/child@side.vue
    const pages: NuxtPage[] = [
      {
        path: '/parent',
        file: 'pages/parent.vue',
        name: 'parent',
        children: [
          {
            path: 'child',
            file: 'pages/parent/child.vue',
            children: [],
            name: 'parent-child',
            components: { default: 'pages/parent/child.vue', side: 'pages/parent/child@side.vue' },
          },
        ],
      },
    ]
    restoreParallelPages(pages, ENABLED)

    expect(pages).toEqual([
      {
        path: '/parent',
        file: 'pages/parent.vue',
        name: 'parent',
        children: [
          { path: 'child', file: 'pages/parent/child.vue', children: [], name: 'parent-child' },
        ],
      },
      { path: '/parent/child@side', file: 'pages/parent/child@side.vue' },
    ])
  })
})
