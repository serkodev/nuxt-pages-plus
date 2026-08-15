import type { Page } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { createPage, setup, url, waitForHydration } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('modal-basic fixture', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/modal-basic', import.meta.url)),
    browser: true,
    setupTimeout: 600_000,
  })

  function modal(page: Page) {
    return page.locator('.modal-wrapper')
  }

  async function expectModalOpenWithIndexBackground(page: Page) {
    // the info modal (pages/info@modal.vue) pops up
    await modal(page).getByRole('heading', { name: 'info modal' }).waitFor()
    expect(await modal(page).getByRole('button', { name: 'Close' }).isVisible()).toBe(true)
    // the background view remains the index page, and it is the retained element
    // stamped in openInfoModal — a remounted index would lose the attribute
    expect(await page.getByRole('heading', { name: 'index page' }).isVisible()).toBe(true)
    expect(await page.getByRole('heading', { name: 'index page' }).getAttribute('data-live')).toBe('1')
    expect(await page.getByRole('link', { name: 'Open info modal' }).isVisible()).toBe(true)
  }

  async function openInfoModal(page: Page) {
    // stamp the live index heading so background retention (no remount) can be asserted
    await page.evaluate(() => document.querySelector('h1')?.setAttribute('data-live', '1'))
    await page.getByRole('link', { name: 'Open info modal' }).click()
    await page.waitForURL(url('/info'))
    await expectModalOpenWithIndexBackground(page)
  }

  async function closeModal(page: Page) {
    await modal(page).getByRole('button', { name: 'Close' }).click()
    await page.waitForURL(url('/'))
    await page.waitForFunction(() => !document.querySelector('.modal-wrapper'))
  }

  it('keeps the PlusModalNuxtPage fallback page-only for backward compatibility', async () => {
    const page = await createPage('/')

    await page.getByRole('heading', { name: 'index page' }).waitFor()
    expect(await page.locator('[data-layout="legacy"]').count()).toBe(0)

    await page.close()
  }, 120_000)

  it('opens the info modal and retains the index background view', async () => {
    const page = await createPage('/')

    // index page renders without a modal
    expect(await page.getByRole('heading', { name: 'index page' }).isVisible()).toBe(true)
    expect(await modal(page).count()).toBe(0)

    // clicking "Open info modal" changes the url to /info and pops up the modal
    await openInfoModal(page)

    // opening pushed exactly one history entry: ['/', '/info']
    expect(await page.evaluate(() => (window as any).navigation.entries().length)).toBe(2)

    await page.close()
  }, 120_000)

  it('exposes the modal parallel route reactively via useParallelRoute', async () => {
    const page = await createPage('/')

    // the modal parallel router has no match for / and stays on its initial route
    expect((await page.locator('#modal-route-path').textContent())?.trim()).toBe('/')

    // opening the modal navigates the parallel router, and the route object
    // returned by useParallelRoute must reflect it reactively
    await openInfoModal(page)
    expect((await page.locator('#modal-route-path').textContent())?.trim()).toBe('/info')

    await page.close()
  }, 120_000)

  it('closes the modal like a browser back navigation', async () => {
    const page = await createPage('/')
    await openInfoModal(page)

    // closing the modal returns to / and removes the modal
    await closeModal(page)
    expect(await page.getByRole('heading', { name: 'index page' }).isVisible()).toBe(true)
    expect(await page.getByRole('heading', { name: 'index page' }).getAttribute('data-live')).toBe('1')

    // close performs a history back, so forward navigation becomes available
    expect(await page.evaluate(() => (window as any).navigation.canGoForward)).toBe(true)

    await page.close()
  }, 120_000)

  it('reopens the modal with the browser forward button', async () => {
    const page = await createPage('/')
    await openInfoModal(page)
    await closeModal(page)

    // browser forward navigates back to /info and pops up the modal again
    await page.goForward()
    await page.waitForURL(url('/info'))
    await expectModalOpenWithIndexBackground(page)

    // forward-reopen consumed the only forward entry — history stays ['/', '/info']
    expect(await page.evaluate(() => (window as any).navigation.canGoForward)).toBe(false)

    await page.close()
  }, 120_000)

  it('shows the standalone info page when refreshing while the modal is open', async () => {
    const page = await createPage('/')
    await openInfoModal(page)

    await page.reload()
    await waitForHydration(page, url('/info'), 'hydration')

    // the url stays /info, but it now renders pages/info.vue directly
    expect(page.url()).toBe(url('/info'))
    await page.getByRole('heading', { name: 'info page' }).waitFor()
    expect(await page.getByRole('link', { name: 'Go to index page' }).isVisible()).toBe(true)

    // history.state.backgroundView persists across the reload — settle briefly so a
    // deferred restoration cannot resurrect the modal or the index background view
    // after the absence checks pass
    await page.waitForTimeout(300)
    expect(await modal(page).count()).toBe(0)
    expect(await page.getByRole('heading', { name: 'index page' }).count()).toBe(0)
    expect(await page.getByRole('heading', { name: 'info page' }).isVisible()).toBe(true)

    await page.close()
  }, 120_000)

  it('renders the standalone info page for a plain link navigation after using the modal', async () => {
    const page = await createPage('/')
    await openInfoModal(page)
    await closeModal(page)

    // an ordinary NuxtLink navigation must not reuse the stale modal background
    await page.getByRole('link', { name: 'Go to info page' }).click()
    await page.waitForURL(url('/info'))
    await page.getByRole('heading', { name: 'info page' }).waitFor()

    expect(await modal(page).count()).toBe(0)
    expect(await page.getByRole('heading', { name: 'index page' }).count()).toBe(0)

    await page.close()
  }, 120_000)
})
