import type { Page } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { createPage, setup, url } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('parallel-pages-options fixture', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/parallel-pages-options', import.meta.url)),
    browser: true,
    setupTimeout: 600_000,
  })

  function view(page: Page, outlet: 'left' | 'global' | 'right', name: string) {
    return page.locator(`#${outlet}`).getByRole('heading', { name, exact: true })
  }

  it('opens the left router at its configured index when the url has no match', async () => {
    const page = await createPage('/')

    await view(page, 'global', 'index page').waitFor()
    // the left router has no `/` page, so it falls back to `index: '/foo'`
    await view(page, 'left', 'left foo').waitFor()
    await view(page, 'right', 'right index').waitFor()

    await page.close()
  }, 120_000)

  it('redirects the right router to its fallback while the left router keeps its view', async () => {
    const page = await createPage('/')

    // stamp the live left view so retention (no remount) can be asserted
    await view(page, 'left', 'left foo').evaluate(el => el.setAttribute('data-live', '1'))

    await page.getByRole('link', { name: 'Go to test page' }).click()
    await page.waitForURL(url('/test'))
    await view(page, 'global', 'test page').waitFor()

    // the right router has no `/test` page, so it redirects to `fallback.redirect`
    // internally, leaving the browser url alone
    await view(page, 'right', 'right not-found').waitFor()
    expect(page.url()).toBe(url('/test'))

    // the left router has no `/test` page and no fallback redirect, so it keeps
    // its last view
    expect(await view(page, 'left', 'left foo').getAttribute('data-live')).toBe('1')

    // a matching url brings the right router back from its fallback
    await page.getByRole('link', { name: 'Go to index page' }).click()
    await page.waitForURL(url('/'))
    await view(page, 'right', 'right index').waitFor()
    expect(await view(page, 'left', 'left foo').getAttribute('data-live')).toBe('1')

    await page.close()
  }, 120_000)

  it('applies both fallbacks on a direct load of an unmatched url', async () => {
    const page = await createPage('/test')

    await view(page, 'global', 'test page').waitFor()
    await view(page, 'left', 'left foo').waitFor()
    await view(page, 'right', 'right not-found').waitFor()

    await page.close()
  }, 120_000)
})
