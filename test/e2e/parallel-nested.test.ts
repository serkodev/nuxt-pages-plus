import type { Page } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { createPage, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('parallel-nested fixture', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/parallel-nested', import.meta.url)),
    browser: true,
    setupTimeout: 600_000,
  })

  async function expectProbe(page: Page, view: string, value: string) {
    expect((await page.locator(`${view} > .router-probe`).textContent())?.trim()).toBe(value)
  }

  it('renders parallel pages nested in parallel pages under composed router names', async () => {
    const page = await createPage('/')

    // pages/index.vue renders in the global router
    await expectProbe(page, '#global', 'global:/')
    // pages/index@foo.vue renders in the `foo` outlet of the global page
    await expectProbe(page, '#global #foo', 'foo:/')
    // pages/index@foo@bar.vue renders in the `bar` outlet of the foo page, whose
    // router name is scoped by the enclosing `foo` outlet
    await expectProbe(page, '#global #foo #bar', 'foo/bar:/')

    await page.close()
  }, 120_000)
})
