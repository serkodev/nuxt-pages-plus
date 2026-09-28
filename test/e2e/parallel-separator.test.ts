import { fileURLToPath } from 'node:url'
import { createPage, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('parallel-separator fixture', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/parallel-separator', import.meta.url)),
    browser: true,
    setupTimeout: 600_000,
  })

  it('renders `+` page files as parallel routes and ignores `@` ones', async () => {
    const page = await createPage('/')

    await page.getByRole('heading', { name: 'index page' }).waitFor()

    // pages/index+left.vue and pages/+main/index.vue are parallel routes...
    await page.locator('#left').getByRole('heading', { name: 'left index' }).waitFor()
    await page.locator('#main').getByRole('heading', { name: 'main index' }).waitFor()

    // ...but pages/index@right.vue is not, so the `right` outlet has no router
    // to render and the file shows up nowhere
    expect(await page.locator('#right > *').count()).toBe(0)
    expect(await page.getByRole('heading', { name: 'right index' }).count()).toBe(0)

    await page.close()
  }, 120_000)
})
