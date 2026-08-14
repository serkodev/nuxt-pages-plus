import type { Page } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { createPage, setup, url, waitForHydration } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

// the fixture's standalone gallery page (pages/gallery/[id].vue) awaits this
// long in its setup, so navigations towards it keep the previous page (and its
// modal outlet) mounted while the suspense is pending
const ASYNC_DELAY = 800

describe('modal-async fixture', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/modal-async', import.meta.url)),
    browser: true,
    setupTimeout: 600_000,
  })

  function modal(page: Page) {
    return page.locator('.modal-wrapper')
  }

  async function expectGalleryModal(page: Page, id: number) {
    await modal(page).getByRole('heading', { name: `gallery modal ${id}` }).waitFor()
    expect(await page.getByRole('heading', { name: 'index page' }).isVisible()).toBe(true)
  }

  async function expectStandaloneGallery(page: Page, id: number) {
    await page.getByRole('heading', { name: `gallery page ${id}` }).waitFor()
    expect(await modal(page).count()).toBe(0)
    expect(await page.getByRole('heading', { name: 'index page' }).count()).toBe(0)
  }

  async function openGalleryModal(page: Page) {
    await page.getByRole('link', { name: 'Open gallery 1' }).click()
    await page.waitForURL(url('/gallery/1'))
    await expectGalleryModal(page, 1)
  }

  // records whether a .modal-wrapper element ever enters the DOM from now on,
  // catching a modal flash even if a later assertion would run too late
  async function watchForModalFlash(page: Page) {
    await page.evaluate(() => {
      (window as any).__modalSeen = false
      new MutationObserver(() => {
        if (document.querySelector('.modal-wrapper'))
          (window as any).__modalSeen = true
      }).observe(document.body, { childList: true, subtree: true })
    })
  }

  async function expectNoModalFlash(page: Page) {
    expect(await page.evaluate(() => (window as any).__modalSeen)).toBe(false)
  }

  it('does not flash the modal when navigating forward to a refreshed (plain) entry', async () => {
    const page = await createPage('/')
    await openGalleryModal(page)

    // refresh while the modal is open → the entry renders standalone
    await page.reload()
    await waitForHydration(page, url('/gallery/1'), 'hydration')
    await expectStandaloneGallery(page, 1)

    // browser back → index without a modal
    await page.goBack()
    await page.waitForURL(url('/'))
    await page.getByRole('heading', { name: 'index page' }).waitFor()
    expect(await modal(page).count()).toBe(0)

    // browser forward → the standalone page's async setup keeps the index page
    // mounted while the navigation is pending; the modal must not pop up over
    // it during that window
    await watchForModalFlash(page)
    await page.goForward()
    await page.waitForURL(url('/gallery/1'))

    // mid-pending: index still shown, but no modal
    await page.waitForTimeout(ASYNC_DELAY / 2)
    expect(await modal(page).count()).toBe(0)

    // after the suspense resolves it renders standalone, and the modal never
    // appeared in between
    await expectStandaloneGallery(page, 1)
    await expectNoModalFlash(page)

    await page.close()
  }, 120_000)

  // same scenario as above, but the standalone page awaits real data fetches
  // instead of a timer — after refresh + back, purgeCachedData has dropped the
  // cached entries, so forward re-fetches and the suspense stays pending for
  // the round-trip duration
  async function expectNoFlashOnForwardToRefreshedEntry(page: Page, name: string, pendingMs: number) {
    await page.getByRole('link', { name: `Open ${name} 1` }).click()
    await page.waitForURL(url(`/${name}/1`))
    await modal(page).getByRole('heading', { name: `${name} modal` }).waitFor()

    await page.reload()
    await waitForHydration(page, url(`/${name}/1`), 'hydration')
    await page.getByRole('heading', { name: `${name} page 1` }).waitFor()
    expect(await modal(page).count()).toBe(0)

    await page.goBack()
    await page.waitForURL(url('/'))
    await page.getByRole('heading', { name: 'index page' }).waitFor()
    expect(await modal(page).count()).toBe(0)

    await watchForModalFlash(page)
    await page.goForward()
    await page.waitForURL(url(`/${name}/1`))

    await page.waitForTimeout(pendingMs / 2)
    expect(await modal(page).count()).toBe(0)

    await page.getByRole('heading', { name: `${name} page 1` }).waitFor()
    expect(await modal(page).count()).toBe(0)
    await expectNoModalFlash(page)
  }

  it('does not flash the modal when the refreshed entry awaits a single useFetch', async () => {
    // sync-setup modal: renders as soon as the parallel router syncs, so
    // without the isOpen gate this flashes for the whole fetch round trip
    const page = await createPage('/')
    await expectNoFlashOnForwardToRefreshedEntry(page, 'fetch-one', 300)
    await page.close()
  }, 120_000)

  it('does not flash the modal when the refreshed entry awaits two sequential useFetch', async () => {
    // async-setup modal sharing the page's first fetch (deduped by key) — the
    // common real-world shape. Vue never renders an async-setup component
    // while the page suspense is pending, so this variant did not flash even
    // before the isOpen gate; the test locks that behavior and that an async
    // modal still opens correctly through the modal link
    const page = await createPage('/')
    await expectNoFlashOnForwardToRefreshedEntry(page, 'fetch-two', 400)
    await page.close()
  }, 120_000)

  it('still restores the modal when navigating forward to a non-refreshed entry', async () => {
    const page = await createPage('/')
    await openGalleryModal(page)

    // close → back to index
    await modal(page).getByRole('button', { name: 'Close' }).click()
    await page.waitForURL(url('/'))
    await page.waitForFunction(() => !document.querySelector('.modal-wrapper'))

    // forward → the entry kept its modal state, so the modal reopens over the
    // index background (the async standalone page must not be involved at all)
    await page.goForward()
    await page.waitForURL(url('/gallery/1'))
    await expectGalleryModal(page, 1)

    await page.close()
  }, 120_000)

  it('keeps the modal mounted when a guard aborts a browser back', async () => {
    const page = await createPage('/')
    await openGalleryModal(page)

    // vue-router fires afterEach with a failure while history.state still
    // belongs to the popped target entry, then restores the entry silently —
    // the aborted navigation must not desync the modal state
    await page.evaluate(() => {
      (window as any).__blockLeave = true
    })
    await page.goBack().catch(() => {})
    await page.waitForTimeout(300)

    expect(page.url()).toBe(url('/gallery/1'))
    await expectGalleryModal(page, 1)

    // the modal must still be fully functional: unblock and close back to index
    await page.evaluate(() => {
      (window as any).__blockLeave = false
    })
    await modal(page).getByRole('button', { name: 'Close' }).click()
    await page.waitForURL(url('/'))
    await page.waitForFunction(() => !document.querySelector('.modal-wrapper'))
    expect(await page.getByRole('heading', { name: 'index page' }).isVisible()).toBe(true)

    await page.close()
  }, 120_000)

  it('drops the modal immediately when leaving it with a plain link navigation', async () => {
    const page = await createPage('/')
    await openGalleryModal(page)

    // a plain link push targets a plain (modal-less) entry: the modal must not
    // stay up (showing the target id) while the async page is pending
    await page.getByRole('link', { name: 'Go to gallery 5' }).click()
    await page.waitForURL(url('/gallery/5'))

    // mid-pending: the previous page is still mounted, but the modal is gone
    await page.waitForTimeout(ASYNC_DELAY / 2)
    expect(await modal(page).count()).toBe(0)

    await expectStandaloneGallery(page, 5)

    await page.close()
  }, 120_000)
})
