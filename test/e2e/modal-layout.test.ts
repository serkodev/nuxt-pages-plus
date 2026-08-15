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

  async function expectModalAppSlot(page: Page, route: string, layoutName: 'default' | 'blue') {
    expect((await page.locator('#modal-app-slot-route').textContent())?.trim()).toBe(route)
    expect((await page.locator('#modal-app-slot-layout').textContent())?.trim()).toBe(layoutName)
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
    await expectModalAppSlot(page, '/', 'default')

    // stamp the live layout element so retention (no re-layout) can be asserted —
    // a background view rewrapped into another layout would lose the attribute
    await page.evaluate(() => document.querySelector('[data-layout="default"]')?.setAttribute('data-live', '1'))

    // clicking "Open info modal" changes the url to /info and pops up the modal
    await openInfoModal(page)

    // the url is /info, whose page meta declares the 'blue' layout, but the background
    // view (index) must keep the default layout: PlusModalApp uses the
    // background route and its layout while the modal is open
    expect(await page.getByRole('heading', { name: 'index page' }).isVisible()).toBe(true)
    expect(await layout(page, 'blue').count()).toBe(0)
    expect(await layout(page, 'default').getAttribute('data-live')).toBe('1')
    await expectModalAppSlot(page, '/', 'default')

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
    await expectModalAppSlot(page, '/info', 'blue')

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
    await expectModalAppSlot(page, '/info', 'blue')

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
    await expectModalAppSlot(page, '/info', 'blue')

    await page.close()
  }, 120_000)
})
