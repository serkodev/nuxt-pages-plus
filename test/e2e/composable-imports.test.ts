import { execFile } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { writeTypes } from '@nuxt/kit'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

const rootDir = fileURLToPath(new URL('./fixtures/composable-imports', import.meta.url))

describe('composables with auto-import and scanning disabled', async () => {
  await setup({
    rootDir,
    buildDir: fileURLToPath(new URL('./fixtures/composable-imports/.nuxt', import.meta.url)),
    nuxtConfig: {
      hooks: {
        // Test-utils builds do not generate the tsconfig required by vue-tsc.
        ready: nuxt => writeTypes(nuxt),
      },
    },
    setupTimeout: 600_000,
  })

  it('typechecks explicit imports from #imports', async () => {
    await promisify(execFile)(process.execPath, [
      fileURLToPath(new URL('../../node_modules/vue-tsc/bin/vue-tsc.js', import.meta.url)),
      '--noEmit',
      '-p',
      'tsconfig.json',
    ], { cwd: rootDir })
  }, 120_000)

  it('renders all public composables in a production build', async () => {
    expect(await $fetch('/')).toContain('all composables ready')
  })
})
