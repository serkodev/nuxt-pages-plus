import type { Page } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { createPage, setup, url, waitForHydration } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('modal-routes fixture', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/modal-routes', import.meta.url)),
    browser: true,
    setupTimeout: 600_000,
  })

  function modal(page: Page) {
    return page.locator('.modal-wrapper')
  }

  async function expectGalleryModal(page: Page, id: number) {
    // the gallery modal (pages/gallery/[id]@modal.vue) shows the given id...
    await modal(page).getByRole('heading', { name: `gallery modal ${id}` }).waitFor()
    // ...over the index background view
    expect(await page.getByRole('heading', { name: 'index page' }).isVisible()).toBe(true)
  }

  async function expectStandaloneGallery(page: Page, id: number) {
    // the full gallery page (pages/gallery/[id].vue) renders directly
    await page.getByRole('heading', { name: `gallery page ${id}` }).waitFor()
    // settle briefly so a deferred modal restoration cannot slip past the absence checks
    await page.waitForTimeout(300)
    expect(await modal(page).count()).toBe(0)
    expect(await page.getByRole('heading', { name: 'index page' }).count()).toBe(0)
    expect(await page.getByRole('heading', { name: `gallery page ${id}` }).isVisible()).toBe(true)
  }

  async function expectRetainedIndexBackground(page: Page) {
    // the background index element stamped in openGalleryModal is still the live
    // one — a remounted index would lose the attribute
    expect(await page.getByRole('heading', { name: 'index page' }).getAttribute('data-live')).toBe('1')
  }

  async function openGalleryModal(page: Page) {
    // stamp the live index heading so background retention (no remount) can be asserted
    await page.evaluate(() => document.querySelector('h1')?.setAttribute('data-live', '1'))
    await page.getByRole('link', { name: 'Open gallery 1' }).click()
    await page.waitForURL(url('/gallery/1'))
    await expectGalleryModal(page, 1)
    await expectRetainedIndexBackground(page)
  }

  it('pushes to another gallery inside the modal and navigates back', async () => {
    const page = await createPage('/')

    // index page renders without a modal
    expect(await page.getByRole('heading', { name: 'index page' }).isVisible()).toBe(true)
    expect(await modal(page).count()).toBe(0)

    // open the gallery/1 modal over the index background
    await openGalleryModal(page)

    // push inside the modal → url /gallery/2, modal switches, background retained
    await modal(page).getByRole('button', { name: 'Push next' }).click()
    await page.waitForURL(url('/gallery/2'))
    await expectGalleryModal(page, 2)
    await expectRetainedIndexBackground(page)

    // the push added exactly one entry: ['/', '/gallery/1', '/gallery/2']
    expect(await page.evaluate(() => (window as any).navigation.entries().length)).toBe(3)

    // browser back → modal returns to gallery/1, background retained
    await page.goBack()
    await page.waitForURL(url('/gallery/1'))
    await expectGalleryModal(page, 1)
    await expectRetainedIndexBackground(page)

    await page.close()
  }, 120_000)

  it('replaces the modal route so back returns directly to index', async () => {
    const page = await createPage('/')
    await openGalleryModal(page)

    // replace inside the modal → url /gallery/9, modal switches, background retained
    await modal(page).getByRole('link', { name: 'Replace with last' }).click()
    await page.waitForURL(url('/gallery/9'))
    await expectGalleryModal(page, 9)
    await expectRetainedIndexBackground(page)

    // replace overwrote the gallery/1 entry — history stays ['/', '/gallery/9']
    expect(await page.evaluate(() => (window as any).navigation.entries().length)).toBe(2)

    // browser back skips the replaced gallery/1 and returns to index
    await page.goBack()
    await page.waitForURL(url('/'))
    await page.waitForFunction(() => !document.querySelector('.modal-wrapper'))
    expect(await page.getByRole('heading', { name: 'index page' }).isVisible()).toBe(true)

    await page.close()
  }, 120_000)

  it('closes the modal back to index after an in-modal push', async () => {
    const page = await createPage('/')
    await openGalleryModal(page)

    // push inside the modal so the close must unwind two history entries
    await modal(page).getByRole('button', { name: 'Push next' }).click()
    await page.waitForURL(url('/gallery/2'))
    await expectGalleryModal(page, 2)

    // close performs router.go(-stackSize) — must skip the /gallery/1 modal entry
    await modal(page).getByRole('button', { name: 'Close' }).click()
    await page.waitForURL(url('/'))
    await page.waitForFunction(() => !document.querySelector('.modal-wrapper'))
    await expectRetainedIndexBackground(page)

    await page.close()
  }, 120_000)

  it('restores the modal of an earlier entry when navigating back after a refresh', async () => {
    const page = await createPage('/')
    await openGalleryModal(page)

    // push to gallery/2, then refresh → the current entry renders standalone
    await modal(page).getByRole('button', { name: 'Push next' }).click()
    await page.waitForURL(url('/gallery/2'))
    await expectGalleryModal(page, 2)

    await page.reload()
    await waitForHydration(page, url('/gallery/2'), 'hydration')
    expect(page.url()).toBe(url('/gallery/2'))
    await expectStandaloneGallery(page, 2)

    // the background view stored in the /gallery/1 history entry survives the
    // refresh — back reopens it as a modal over the index background
    await page.goBack()
    await page.waitForURL(url('/gallery/1'))
    await expectGalleryModal(page, 1)

    // forward again → only the refreshed entry lost its modal context
    await page.goForward()
    await page.waitForURL(url('/gallery/2'))
    await expectStandaloneGallery(page, 2)

    await page.close()
  }, 120_000)

  it('keeps the refreshed entry as a plain page when navigating forward again', async () => {
    const page = await createPage('/')
    await openGalleryModal(page)

    // refresh while the modal is open → the entry renders standalone
    await page.reload()
    await waitForHydration(page, url('/gallery/1'), 'hydration')
    await expectStandaloneGallery(page, 1)

    // the strip must neutralize only the module's keys (as explicit undefined,
    // so they shadow vue-router's stale cached copy) and keep vue-router's own
    const state = await page.evaluate(() => ({ ...window.history.state }))
    expect(state.backgroundView).toBeUndefined()
    expect(state.id).toBeUndefined()
    expect(state.current).toBe('/gallery/1')
    expect(typeof state.position).toBe('number')

    // browser back → index without a modal (freshly mounted, so wait for it)
    await page.goBack()
    await page.waitForURL(url('/'))
    await page.getByRole('heading', { name: 'index page' }).waitFor()
    expect(await modal(page).count()).toBe(0)

    // browser forward → the refreshed entry renders standalone again, not as a modal
    await page.goForward()
    await page.waitForURL(url('/gallery/1'))
    await expectStandaloneGallery(page, 1)

    await page.close()
  }, 120_000)

  it('keeps the refreshed entry as a plain page after navigating away with a plain link', async () => {
    const page = await createPage('/')
    await openGalleryModal(page)

    // refresh while the modal is open → the entry renders standalone
    await page.reload()
    await waitForHydration(page, url('/gallery/1'), 'hydration')
    await expectStandaloneGallery(page, 1)

    // leave via a plain link push — vue-router rewrites the current entry's
    // state on push, which must not resurrect the stripped modal state
    await page.getByRole('link', { name: 'Go to index page' }).click()
    await page.waitForURL(url('/'))
    await page.getByRole('heading', { name: 'index page' }).waitFor()

    // browser back → the refreshed entry still renders standalone
    await page.goBack()
    await page.waitForURL(url('/gallery/1'))
    await expectStandaloneGallery(page, 1)

    await page.close()
  }, 120_000)
})
