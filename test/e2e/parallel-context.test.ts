import type { Page } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { createPage, setup, url } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('parallel route context', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/parallel-context', import.meta.url)),
    browser: true,
    setupTimeout: 600_000,
  })

  async function expectRoute(page: Page, selector: string, value: string) {
    await page.waitForFunction(
      ({ selector, value }) => document.querySelector(selector)?.textContent?.trim() === value,
      { selector, value },
      { timeout: 10_000 },
    )
  }

  async function expectSharedRoute(page: Page, selector: string, value: string) {
    await expectRoute(page, selector, value)
    expect(await page.locator(selector).getAttribute('data-shared')).toBe('true')
    expect(await page.locator(selector).getAttribute('data-stable')).toBe('true')
  }

  it('preserves shared route identity and navigation updates without a route binding', async () => {
    const page = await createPage('/item/9?q=top')
    const selectors = ['#global p', '#default .side-probe', '#default-sibling .side-probe']

    for (const selector of selectors)
      await expectSharedRoute(page, selector, '9:top')
    await page.locator('#default .side-probe').evaluate(el => el.setAttribute('data-live', '1'))
    expect(await page.locator('#default-sibling [data-forwarded="yes"]').count()).toBe(1)

    await page.locator('#navigate').click()
    await page.waitForURL(url('/item/10?q=next'))

    for (const selector of selectors)
      await expectSharedRoute(page, selector, '10:next')
    expect(await page.locator('#default .side-probe').getAttribute('data-live')).toBe('1')

    await page.close()
  }, 120_000)

  it('keeps explicit route layers independent and reacts to prop changes', async () => {
    const page = await createPage('/item/9?q=top')
    await expectRoute(page, '#lower .side-probe', '1:lower')
    await expectRoute(page, '#upper .side-probe', '2:upper')
    await page.locator('#lower .side-probe').evaluate(el => el.setAttribute('data-live', '1'))

    await page.locator('#update-lower').click()
    await expectRoute(page, '#lower .side-probe', '4:updated')
    expect(await page.locator('#lower .side-probe').getAttribute('data-live')).toBe('1')
    await expectRoute(page, '#upper .side-probe', '2:upper')
    await expectSharedRoute(page, '#default .side-probe', '9:top')

    await page.locator('#navigate').click()
    await page.waitForURL(url('/item/10?q=next'))
    await expectRoute(page, '#lower .side-probe', '4:updated')
    await expectRoute(page, '#upper .side-probe', '2:upper')

    await page.close()
  }, 120_000)

  it('remounts when an undefined route becomes explicit or is cleared', async () => {
    const page = await createPage('/item/9?q=top')
    await expectSharedRoute(page, '#late .side-probe', '9:top')
    await page.locator('#late .side-probe').evaluate(el => el.setAttribute('data-live', 'shared'))

    await page.locator('#set-late').click()
    await expectRoute(page, '#late .side-probe', '3:late')
    expect(await page.locator('#late .side-probe').getAttribute('data-live')).toBeNull()
    expect(await page.locator('#late .side-probe').getAttribute('data-shared')).toBe('false')
    await expectSharedRoute(page, '#default .side-probe', '9:top')
    await page.locator('#late .side-probe').evaluate(el => el.setAttribute('data-live', 'explicit'))

    await page.locator('#clear-late').click()
    await expectSharedRoute(page, '#late .side-probe', '9:top')
    expect(await page.locator('#late .side-probe').getAttribute('data-live')).toBeNull()
    await page.locator('#late .side-probe').evaluate(el => el.setAttribute('data-live', 'shared'))
    await page.locator('#navigate').click()
    await page.waitForURL(url('/item/10?q=next'))
    await expectSharedRoute(page, '#late .side-probe', '10:next')
    expect(await page.locator('#late .side-probe').getAttribute('data-live')).toBe('shared')

    await page.locator('#set-late').click()
    await expectRoute(page, '#late .side-probe', '3:late')
    expect(await page.locator('#late .side-probe').getAttribute('data-live')).toBeNull()

    await page.close()
  }, 120_000)

  it('uses the nested shared route when only the outer outlet has an explicit route', async () => {
    const page = await createPage('/item/9?q=top')
    await expectRoute(page, '#lower .side-probe', '1:lower')
    await expectSharedRoute(page, '#lower .child-probe', '9:top')

    await page.locator('#navigate').click()
    await page.waitForURL(url('/item/10?q=next'))
    await expectRoute(page, '#lower .side-probe', '1:lower')
    await expectSharedRoute(page, '#lower .child-probe', '10:next')

    await page.close()
  }, 120_000)

  it('switches context when v-bind dynamically adds or removes the route prop', async () => {
    const page = await createPage('/item/9?q=top')
    await expectSharedRoute(page, '#dynamic .side-probe', '9:top')

    await page.locator('#set-dynamic').click()
    await expectRoute(page, '#dynamic .side-probe', '5:dynamic')
    expect(await page.locator('#dynamic .side-probe').getAttribute('data-shared')).toBe('false')
    await expectSharedRoute(page, '#default .side-probe', '9:top')

    await page.locator('#navigate').click()
    await page.waitForURL(url('/item/10?q=next'))
    await expectRoute(page, '#dynamic .side-probe', '5:dynamic')

    await page.locator('#clear-dynamic').click()
    await expectSharedRoute(page, '#dynamic .side-probe', '10:next')

    await page.close()
  }, 120_000)

  it('updates route context in fallback slots when the override is set or cleared', async () => {
    const page = await createPage('/item/9?q=top')
    await page.locator('#show-fallback').click()
    await expectSharedRoute(page, '#fallback .fallback-probe', '9:top')
    await page.locator('#fallback .fallback-probe').evaluate(el => el.setAttribute('data-live', 'shared'))

    await page.locator('#set-late').click()
    await expectRoute(page, '#fallback .fallback-probe', '3:late')
    expect(await page.locator('#fallback .fallback-probe').getAttribute('data-live')).toBeNull()
    expect(await page.locator('#fallback .fallback-probe').getAttribute('data-shared')).toBe('false')

    await page.locator('#clear-late').click()
    await expectSharedRoute(page, '#fallback .fallback-probe', '9:top')

    await page.close()
  }, 120_000)

  it('still respects the experimental page key within an explicit route context', async () => {
    const page = await createPage('/item/9?q=top')
    await expectRoute(page, '#lower .side-probe', '1:lower')
    await page.locator('#lower .side-probe').evaluate(el => el.setAttribute('data-live', '1'))

    await page.locator('#change-page-key').click()
    await expectRoute(page, '#lower .side-probe', '4:keyed')
    expect(await page.locator('#lower .side-probe').getAttribute('data-live')).toBeNull()

    await page.close()
  }, 120_000)
})
