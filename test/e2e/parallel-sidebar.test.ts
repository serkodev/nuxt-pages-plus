import type { Page } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { createPage, setup, url } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('parallel-sidebar fixture', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/parallel-sidebar', import.meta.url)),
    browser: true,
    setupTimeout: 600_000,
  })

  function view(page: Page, outlet: 'left' | 'main', name: string) {
    return page.locator(`#${outlet}`).getByRole('heading', { name, exact: true })
  }

  // pages/@main/topic/[id].vue reads the params and query of the main router's route
  async function expectTopic(page: Page, id: number, foo: string) {
    await view(page, 'main', `main topic ${id}`).waitFor()
    expect((await page.locator('#topic-query-foo').textContent())?.trim()).toBe(foo)
  }

  async function openTopic(page: Page, id: number, path: string) {
    await page.locator('#left').getByRole('link', { name: `Topic ${id}` }).click()
    await page.waitForURL(url(path))
  }

  it('keeps the sidebar while the main view follows the topic links', async () => {
    const page = await createPage('/')
    await view(page, 'left', 'left index').waitFor()
    await view(page, 'main', 'main index').waitFor()

    // the main router follows the url with its params and query, while the left
    // router has no `/topic/:id` page and keeps its topic list
    await openTopic(page, 1, '/topic/1?foo=f1')
    await expectTopic(page, 1, 'f1')
    await view(page, 'left', 'left index').waitFor()

    await openTopic(page, 2, '/topic/2?foo=f2')
    await expectTopic(page, 2, 'f2')
    await view(page, 'left', 'left index').waitFor()

    await page.close()
  }, 120_000)

  it('switches the sidebar while the main view keeps its last page', async () => {
    const page = await createPage('/')
    await openTopic(page, 1, '/topic/1?foo=f1')
    await expectTopic(page, 1, 'f1')

    // the left router switches to its bookmark list, while the main router has
    // no `/bookmark` page and keeps showing the last topic
    await page.getByRole('link', { name: 'Bookmark' }).click()
    await page.waitForURL(url('/bookmark'))
    await view(page, 'left', 'left bookmark').waitFor()
    await expectTopic(page, 1, 'f1')

    // bookmarked topic links carry no query
    await openTopic(page, 6, '/topic/6')
    await expectTopic(page, 6, '')
    await view(page, 'left', 'left bookmark').waitFor()

    await page.getByRole('link', { name: 'About' }).click()
    await page.waitForURL(url('/about'))
    await view(page, 'main', 'main about').waitFor()
    await view(page, 'left', 'left bookmark').waitFor()

    await page.close()
  }, 120_000)

  it('falls back to the left ~index page on a direct load of an unmatched url', async () => {
    const page = await createPage('/topic/2?foo=f2')
    await expectTopic(page, 2, 'f2')

    // the left router has no `/topic/:id` page: on initial load it falls back to
    // its `/~index` page, which takes precedence over the #index slot
    await view(page, 'left', 'left fallback index').waitFor()
    expect(await page.getByText('left index slot').count()).toBe(0)

    // the fallback lasts only until the left router matches the url again
    await page.getByRole('link', { name: 'Home' }).click()
    await page.waitForURL(url('/'))
    await view(page, 'left', 'left index').waitFor()
    await view(page, 'main', 'main index').waitFor()

    await page.close()
  }, 120_000)

  it('falls back to the main ~index page on a direct load of an unmatched url', async () => {
    const page = await createPage('/bookmark')

    await view(page, 'left', 'left bookmark').waitFor()
    await view(page, 'main', 'main fallback index').waitFor()

    await page.close()
  }, 120_000)
})
