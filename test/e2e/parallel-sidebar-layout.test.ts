import type { Page } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { createPage, setup, url } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('parallel-sidebar-layout fixture', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/parallel-sidebar-layout', import.meta.url)),
    browser: true,
    setupTimeout: 600_000,
  })

  function view(page: Page, outlet: 'left' | 'global' | 'right', name: string) {
    return page.locator(`#${outlet}`).getByRole('heading', { name, exact: true })
  }

  it('renders the parallel pages around the layout slot', async () => {
    const page = await createPage('/')

    await view(page, 'global', 'index page').waitFor()
    await view(page, 'left', 'left index').waitFor()
    // pages/@right/[...all].vue catches every url without a more specific right page
    await view(page, 'right', 'right catch-all').waitFor()

    await page.close()
  }, 120_000)

  it('syncs each parallel router with the url independently', async () => {
    const page = await createPage('/')

    // stamp the live left view so retention (no remount) can be asserted
    await view(page, 'left', 'left index').evaluate(el => el.setAttribute('data-live', '1'))

    // pages/topic/@right/[id].vue follows the global topic page, while the left
    // router has no `/topic/:id` page and keeps its topic list
    await page.locator('#left').getByRole('link', { name: 'Topic 3' }).click()
    await page.waitForURL(url('/topic/3'))
    await view(page, 'global', 'topic page 3').waitFor()
    await view(page, 'right', 'right topic 3').waitFor()
    expect(await view(page, 'left', 'left index').getAttribute('data-live')).toBe('1')

    // `/bookmark` only exists in the left router: the global catch-all page
    // lists the parallel routers that resolve it
    await page.getByRole('link', { name: 'Bookmark' }).click()
    await page.waitForURL(url('/bookmark'))
    await view(page, 'global', 'catch-all page').waitFor()
    const resolvingRouters = await page.locator('#resolving-routers li').allTextContents()
    expect(resolvingRouters.map(name => name.trim()).sort()).toEqual(['left', 'right'])
    await view(page, 'left', 'left bookmark').waitFor()
    await view(page, 'right', 'right catch-all').waitFor()

    await page.getByRole('link', { name: 'About' }).click()
    await page.waitForURL(url('/about'))
    await view(page, 'global', 'about page').waitFor()
    await view(page, 'right', 'right about').waitFor()
    await view(page, 'left', 'left bookmark').waitFor()

    await page.close()
  }, 120_000)

  it('renders the #index slot for an unmatched left router on initial load', async () => {
    const page = await createPage('/about')

    await view(page, 'global', 'about page').waitFor()
    await view(page, 'right', 'right about').waitFor()

    // without a pages/@left/~index.vue page, the left router falls back to the
    // #index slot of its PlusParallelPage
    await page.locator('#left').getByText('left index slot').waitFor()

    // the slot gives way once the left router matches the url
    await page.getByRole('link', { name: 'Home' }).click()
    await page.waitForURL(url('/'))
    await view(page, 'left', 'left index').waitFor()
    expect(await page.getByText('left index slot').count()).toBe(0)

    await page.close()
  }, 120_000)

  it('shows an error page for a url the left router cannot resolve', async () => {
    const page = await createPage('/bookmark')

    // only the right router resolves `/blackhole` (through its catch-all page),
    // so the global catch-all page raises an error
    await page.getByRole('link', { name: 'Go to an unresolvable page' }).click()
    await page.waitForURL(url('/blackhole'))
    await page.getByText('Path not found: /blackhole').waitFor()
    expect(await page.locator('#left').count()).toBe(0)

    await page.close()
  }, 120_000)
})
