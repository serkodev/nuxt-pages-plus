import type { Page } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { createPage, setup, url, waitForHydration } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('modal-layout fixture', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/modal-layout', import.meta.url)),
    browser: true,
    setupTimeout: 600_000,
  })

  function layout(page: Page, name: 'default' | 'blue') {
    return page.locator(`[data-layout="${name}"]`)
  }

  // guard against a vacuous pass: the back press must land inside the
  // hydration window, or the test would exercise a plain post-hydration
  // navigation (polls because the entry script may not have run yet when the
  // SSR heading is already visible; fails fast if the window was missed)
  async function expectHydrating(page: Page) {
    await page.waitForFunction(() => (window as any).useNuxtApp?.().isHydrating === true, undefined, { timeout: 5000 })
  }

  async function expectIndexInDefaultLayout(page: Page) {
    await page.getByRole('heading', { name: 'index page' }).waitFor()
    expect(await layout(page, 'default').count()).toBe(1)
    expect(await layout(page, 'blue').count()).toBe(0)
  }

  async function openInfoModal(page: Page) {
    await page.getByRole('link', { name: 'Open info modal' }).click()
    await page.waitForURL(url('/info'))
    await page.locator('.modal-wrapper').getByRole('heading', { name: 'info modal' }).waitFor()
  }

  it('keeps the index background view on the default layout while the info modal is open', async () => {
    const page = await createPage('/')

    // index renders inside the default layout
    await page.getByRole('heading', { name: 'index page' }).waitFor()
    expect(await layout(page, 'default').count()).toBe(1)
    expect(await layout(page, 'blue').count()).toBe(0)

    // stamp the live layout element so retention (no re-layout) can be asserted —
    // a background view rewrapped into another layout would lose the attribute
    await page.evaluate(() => document.querySelector('[data-layout="default"]')?.setAttribute('data-live', '1'))

    // clicking "Open info modal" changes the url to /info and pops up the modal
    await openInfoModal(page)

    // the url is /info, whose page meta declares the 'blue' layout, but the background
    // view (index) must keep the default layout: <NuxtLayout :name="layout"> receives
    // the background route's layout from the PlusModalNuxtPage slot
    expect(await page.getByRole('heading', { name: 'index page' }).isVisible()).toBe(true)
    expect(await layout(page, 'blue').count()).toBe(0)
    expect(await layout(page, 'default').getAttribute('data-live')).toBe('1')

    // closing the modal returns to / with the same retained default layout
    await page.locator('.modal-wrapper').getByRole('button', { name: 'Close' }).click()
    await page.waitForURL(url('/'))
    await page.waitForFunction(() => !document.querySelector('.modal-wrapper'))
    expect(await layout(page, 'blue').count()).toBe(0)
    expect(await layout(page, 'default').getAttribute('data-live')).toBe('1')

    await page.close()
  }, 120_000)

  it('switches to the blue layout when refreshing while the modal is open', async () => {
    const page = await createPage('/')
    await openInfoModal(page)

    // refreshing at /info renders pages/info.vue directly as a full page
    await page.reload()
    await waitForHydration(page, url('/info'), 'hydration')

    expect(page.url()).toBe(url('/info'))
    await page.getByRole('heading', { name: 'info page' }).waitFor()

    // the layout is now 'blue', and index no longer renders as a background view —
    // settle briefly so a deferred background restoration could not slip in after
    // the absence checks pass
    await page.waitForTimeout(300)
    expect(await layout(page, 'blue').count()).toBe(1)
    expect(await layout(page, 'default').count()).toBe(0)
    expect(await page.locator('.modal-wrapper').count()).toBe(0)
    expect(await page.getByRole('heading', { name: 'index page' }).count()).toBe(0)

    await page.close()
  }, 120_000)

  it('renders the standalone info page in the blue layout on direct navigation', async () => {
    const page = await createPage('/info')

    // control: pages/info.vue really is wrapped in the blue layout when it is the
    // active view, so the absence checks above cannot pass vacuously
    await page.getByRole('heading', { name: 'info page' }).waitFor()
    expect(await layout(page, 'blue').count()).toBe(1)
    expect(await layout(page, 'default').count()).toBe(0)
    expect(await page.locator('.modal-wrapper').count()).toBe(0)

    await page.close()
  }, 120_000)

  it('restores the correct layout when going back while the reloaded page is still hydrating', async () => {
    const page = await createPage('/')
    await page.getByRole('heading', { name: 'index page' }).waitFor()

    // plain SPA navigation to the slow page (async setup, blue layout)
    await page.getByRole('link', { name: 'Go to slow page' }).click()
    await page.waitForURL(url('/slow'))
    await page.getByRole('heading', { name: 'slow page' }).waitFor()
    expect(await layout(page, 'blue').count()).toBe(1)

    // reload, then go back IMMEDIATELY — while the slow page's async setup
    // still keeps the initial hydration suspense pending; the navigation must
    // not patch the half-hydrated tree (which would leave the blue layout, or
    // the whole slow page, frozen on screen)
    await page.reload()
    await page.getByRole('heading', { name: 'slow page' }).waitFor()
    await expectHydrating(page)
    await page.goBack()
    await page.waitForURL(url('/'))

    // once hydration settles the deferred navigation completes: index renders
    // inside the default layout again
    await expectIndexInDefaultLayout(page)
    expect(await page.getByRole('heading', { name: 'slow page' }).count()).toBe(0)

    await page.close()
  }, 120_000)

  it('restores the correct layout when going back during hydration after refreshing an open modal', async () => {
    const page = await createPage('/')
    await page.getByRole('heading', { name: 'index page' }).waitFor()

    // open the slow modal over the index background (the standalone slow page
    // never mounts here, so this is instant)
    await page.getByRole('link', { name: 'Open slow modal' }).click()
    await page.waitForURL(url('/slow'))
    await page.locator('.modal-wrapper').getByRole('heading', { name: 'slow modal' }).waitFor()
    expect(await layout(page, 'blue').count()).toBe(0)

    // refresh → the entry renders as the standalone slow page (blue layout);
    // go back IMMEDIATELY, while its async setup still keeps hydration pending
    await page.reload()
    await page.getByRole('heading', { name: 'slow page' }).waitFor()
    await expectHydrating(page)
    await page.goBack()
    await page.waitForURL(url('/'))

    // the deferred navigation completes after hydration: index in the default
    // layout, without a modal
    await expectIndexInDefaultLayout(page)
    expect(await page.locator('.modal-wrapper').count()).toBe(0)

    await page.close()
  }, 120_000)

  it('navigates back normally right after reloading a standard useFetch page', async () => {
    const page = await createPage('/')
    await page.getByRole('heading', { name: 'index page' }).waitFor()

    await page.getByRole('link', { name: 'Go to cached-fetch page' }).click()
    await page.waitForURL(url('/cached-fetch'))
    await page.getByRole('heading', { name: 'cached-fetch page' }).waitFor()

    // standard useFetch reuses the SSR payload while hydrating, so the fetch
    // never delays hydration — an immediate back is a plain navigation that
    // must not be affected by the hydration guard
    await page.reload()
    await page.getByRole('heading', { name: 'cached-fetch page' }).waitFor()
    await page.goBack()
    await page.waitForURL(url('/'))

    await expectIndexInDefaultLayout(page)

    await page.close()
  }, 120_000)

  it('does not hold a programmatic redirect awaited inside a hydrating setup', async () => {
    // pages/redirect.vue awaits navigateTo('/info') in its client-side setup —
    // if the hydration guard held programmatic navigations, the redirect would
    // deadlock against its own pending suspense and this page would hang forever
    const page = await createPage('/redirect')
    await page.waitForURL(url('/info'))
    await page.getByRole('heading', { name: 'info page' }).waitFor()

    await page.close()
  }, 120_000)

  it('applies the blue layout for a plain link navigation to /info', async () => {
    const page = await createPage('/')
    await page.getByRole('heading', { name: 'index page' }).waitFor()

    // an ordinary NuxtLink navigation swaps both the view and its layout
    await page.getByRole('link', { name: 'Go to info page' }).click()
    await page.waitForURL(url('/info'))
    await page.getByRole('heading', { name: 'info page' }).waitFor()
    expect(await layout(page, 'blue').count()).toBe(1)
    expect(await layout(page, 'default').count()).toBe(0)

    await page.close()
  }, 120_000)
})
