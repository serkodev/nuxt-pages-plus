import type { RouteLocationNormalized, RouteLocationNormalizedLoaded, RouterScrollBehavior } from 'vue-router'
import { describe, expect, it, vi } from 'vitest'
import { createModalScrollBehavior } from '../src/runtime/modal-scroll'

function route(path: string, meta: RouteLocationNormalized['meta'] = {}): RouteLocationNormalized {
  return {
    fullPath: path,
    path,
    query: {},
    hash: '',
    name: undefined,
    params: {},
    matched: [],
    meta,
    redirectedFrom: undefined,
  }
}

describe('createModalScrollBehavior', () => {
  it('preserves the current position for a new modal entry', () => {
    const to = route('/info', { scrollToTop: true })
    const from = route('/') as RouteLocationNormalizedLoaded
    const scrollBehavior = vi.fn<RouterScrollBehavior>(() => ({ left: 0, top: 0 }))

    const wrapped = createModalScrollBehavior(scrollBehavior, () => true)

    expect(wrapped(to, from, null)).toBe(false)
    expect(scrollBehavior).not.toHaveBeenCalled()
  })

  it('restores the saved position when revisiting a modal entry', () => {
    const to = route('/info')
    const from = route('/') as RouteLocationNormalizedLoaded
    const savedPosition = { left: 10, top: 20 }
    const scrollBehavior = vi.fn<RouterScrollBehavior>(() => false)

    const wrapped = createModalScrollBehavior(scrollBehavior, () => true)

    expect(wrapped(to, from, savedPosition)).toBe(savedPosition)
    expect(scrollBehavior).not.toHaveBeenCalled()
  })

  it('passes plain navigations to the original scroll behavior unchanged', () => {
    const to = route('/info', { scrollToTop: true })
    const from = route('/') as RouteLocationNormalizedLoaded
    const scrollBehavior = vi.fn<RouterScrollBehavior>(() => false)

    const wrapped = createModalScrollBehavior(scrollBehavior, () => false)

    expect(wrapped(to, from, null)).toBe(false)
    expect(scrollBehavior).toHaveBeenCalledWith(to, from, null)
  })
})
