#!/usr/bin/env node
/* eslint-disable antfu/no-top-level-await, no-console */
/**
 * Compatibility matrix runner.
 *
 * For each target nuxt version, installs the packed module into a standalone
 * copy of ./fixture, then runs: nuxt prepare -> vue-tsc --noEmit ->
 * nuxt build -> SSR smoke assertions -> client (browser) smoke assertions.
 *
 * Usage:
 *   node test/matrix/run.mjs                # full default matrix
 *   node test/matrix/run.mjs 3.21.11 4.5.2  # subset
 *   MATRIX_WORKDIR=/tmp/matrix node test/matrix/run.mjs
 *   MATRIX_KEEP=1     # keep per-version workdirs (default: reused per version)
 *   MATRIX_NO_BROWSER=1  # skip browser step
 */
import { execFileSync, spawn } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const matrixDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(matrixDir, '../..')

// boundary versions of every supported generation:
// nuxt 3 floor / latest (vue-router 4, kit 3)
// nuxt 4 first / last vue-router-4-based (kit 4)
// nuxt 4 first vue-router-5-based / latest (kit 4, unrouting named views)
// `3x` / `latest` are npm dist-tags resolved at run time
// (4.0.3 not 4.0.0: nuxt 4.0.0-4.0.2 ship nitropack 2.12.0, whose node-server
// output serves /_nuxt assets from a wrong path on modern Node - unrelated to
// this module, its SSR/typecheck/build steps pass on 4.0.0 too)
const DEFAULT_VERSIONS = ['3.16.0', '3x', '4.0.3', '4.3.1', '4.4.2', 'latest']

// fresh `npm i nuxt@<old 3.x>` today resolves nuxt's `@nuxt/cli` range to a
// 2026 CLI whose `@nuxt/schema ^4.x` peer gets hoisted to the app root, which
// breaks old @nuxt/kit config loading (v4 defaults on a v3 core) regardless of
// any module. Pin an era-correct CLI for those versions to model a real app.
const CLI_OVERRIDES = {
  '3.16.0': '3.22.5',
}

const versions = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_VERSIONS
const workRoot = process.env.MATRIX_WORKDIR || join(tmpdir(), 'nuxt-pages-plus-matrix')
console.log('workdir:', workRoot)

function sh(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { stdio: 'inherit', ...opts })
}

function shOut(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', ...opts }).trim()
}

// ---- pack the module once ----
console.log('\n=== packing nuxt-pages-plus ===')
if (!existsSync(join(repoRoot, 'dist/module.mjs')))
  throw new Error('dist/module.mjs missing - run `pnpm build` first')
mkdirSync(workRoot, { recursive: true })
// pnpm pack (not npm pack): resolves pnpm `catalog:` refs in dependencies,
// matching what `pnpm publish` ships
const packOut = shOut('pnpm', ['pack', '--pack-destination', workRoot], { cwd: repoRoot })
const tarballName = packOut.split('\n').pop().split('/').pop()
const tarball = join(workRoot, tarballName)
console.log('packed:', tarball)

const results = []

for (const versionOrTag of versions) {
  // allow npm dist-tags (3x, latest) and ranges alongside exact versions
  const viewOut = /^\d+\.\d+\.\d+$/.test(versionOrTag)
    ? versionOrTag
    : shOut('npm', ['view', `nuxt@${versionOrTag}`, 'version']).split('\n').pop()
  // ranges print `nuxt@x.y.z 'x.y.z'` lines; dist-tags print the bare version
  const version = viewOut.match(/'([^']+)'/)?.[1] ?? viewOut
  if (versionOrTag !== version)
    console.log(`\nresolved nuxt@${versionOrTag} -> ${version}`)
  const label = `nuxt@${version}`
  const appDir = join(workRoot, `nuxt-${version.replaceAll('.', '_')}`)
  const steps = {}
  let failed = false

  async function step(name, fn) {
    if (failed) {
      steps[name] = 'skipped'
      return
    }
    process.stdout.write(`\n--- [${label}] ${name} ---\n`)
    try {
      await fn()
      steps[name] = 'ok'
    } catch (err) {
      steps[name] = `FAIL: ${err.message?.split('\n')[0]}`
      failed = true
    }
  }

  console.log(`\n=== ${label} -> ${appDir} ===`)

  await step('install', () => {
    // MATRIX_REUSE=1 keeps an existing install and only refreshes fixture
    // files + the packed module (for fast iteration on fixture/smoke steps)
    const reuse = process.env.MATRIX_REUSE && existsSync(join(appDir, 'node_modules'))
    if (!reuse) {
      rmSync(appDir, { recursive: true, force: true })
      mkdirSync(appDir, { recursive: true })
    }
    cpSync(join(matrixDir, 'fixture'), appDir, { recursive: true })
    writeFileSync(join(appDir, 'package.json'), `${JSON.stringify({
      private: true,
      type: 'module',
      dependencies: {
        'nuxt': version,
        'nuxt-pages-plus': `file:${tarball}`,
      },
      devDependencies: {
        'typescript': '~5.9.3',
        'vue-tsc': '^3.3.9',
      },
      ...CLI_OVERRIDES[version] ? { overrides: { '@nuxt/cli': CLI_OVERRIDES[version] } } : {},
    }, null, 2)}\n`)
    writeFileSync(join(appDir, 'tsconfig.json'), `${JSON.stringify({ extends: './.nuxt/tsconfig.json' }, null, 2)}\n`)
    sh('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], { cwd: appDir })
    const resolved = shOut('node', ['-p', 'require("nuxt/package.json").version'], { cwd: appDir })
    if (resolved !== version)
      throw new Error(`resolved nuxt ${resolved}, expected ${version}`)
    const vr = shOut('node', ['-p', 'require("vue-router/package.json").version'], { cwd: appDir })
    console.log(`resolved: nuxt@${resolved} vue-router@${vr}`)
  })

  await step('prepare', () => {
    sh('npx', ['nuxt', 'prepare'], { cwd: appDir })
  })

  await step('typecheck', () => {
    sh('npx', ['vue-tsc', '--noEmit', '-p', 'tsconfig.json'], { cwd: appDir })
  })

  await step('build', () => {
    sh('npx', ['nuxt', 'build'], { cwd: appDir })
  })

  let server
  let baseURL
  await step('ssr-smoke', async () => {
    const port = 3200 + Math.floor(Math.random() * 500)
    baseURL = `http://127.0.0.1:${port}`
    server = spawn('node', ['.output/server/index.mjs'], {
      cwd: appDir,
      env: { ...process.env, PORT: String(port), NITRO_PORT: String(port) },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let serverOut = ''
    server.stdout.on('data', d => serverOut += d)
    server.stderr.on('data', d => serverOut += d)

    // wait for the server to answer
    let up = false
    for (let i = 0; i < 60; i++) {
      try {
        const res = await fetch(baseURL)
        if (res.ok) {
          up = true
          break
        }
      } catch {}
      await new Promise(r => setTimeout(r, 500))
    }
    if (!up)
      throw new Error(`server did not start: ${serverOut.slice(-500)}`)

    async function expectHTML(path, ...needles) {
      const html = await (await fetch(baseURL + path)).text()
      for (const needle of needles) {
        if (!html.includes(needle))
          throw new Error(`GET ${path}: missing ${JSON.stringify(needle)}`)
      }
    }

    // both routers extracted (modal comes from info@modal.vue - the
    // named-views reclamation path on newer nuxt)
    await expectHTML('/', '[modal,side]', 'main index page', 'side index page')
    // parallel router param/query sync through useParentRoute
    await expectHTML('/topic/3?foo=f3', 'main topic 3', 'side topic id:3 foo:f3')
    // page without matching side route falls back to the not-found slot,
    // direct visit of a modal background route renders the full page
    await expectHTML('/info', 'info page', 'side not found slot')
  })

  await step('client-smoke', async () => {
    if (process.env.MATRIX_NO_BROWSER)
      return
    const { chromium } = await import(join(repoRoot, 'node_modules/playwright-core/index.mjs'))
    const browser = await chromium.launch()
    try {
      const page = await browser.newPage()
      const sel = {
        modalLink: '#link-info-modal',
        modal: '.modal-wrapper #info-modal',
        close: '#close-modal',
        topicLink: '#link-topic',
      }

      await page.goto(baseURL, { waitUntil: 'networkidle' })

      // parallel navigation: side router syncs params/query
      await page.click(sel.topicLink)
      await page.waitForSelector('#side-topic')
      if (!(await page.textContent('#side-topic')).includes('id:3 foo:f3'))
        throw new Error('side router did not sync params/query')
      if (!(await page.textContent('#main-topic')).includes('3'))
        throw new Error('main page did not navigate')

      // modal open: url changes, background view retained
      // (waitForURL: pushState URL changes reach the driver asynchronously)
      await page.click(sel.modalLink)
      await page.waitForURL('**/info')
      await page.waitForSelector(sel.modal)
      if (!(await page.isVisible('#main-topic')))
        throw new Error('background view was not retained while modal open')

      // modal close: back to previous url, modal gone
      await page.click(sel.close)
      await page.waitForURL('**/topic/3?foo=f3')
      await page.waitForSelector(sel.modal, { state: 'detached' })

      // reload while a modal is open: the modal state persisted in
      // history.state must be stripped so the modal does not resurrect
      // (exercises vue-router history.state merge behavior across majors)
      await page.click(sel.modalLink)
      await page.waitForURL('**/info')
      await page.waitForSelector(sel.modal)
      await page.reload({ waitUntil: 'networkidle' })
      if (await page.$(sel.modal))
        throw new Error('modal resurrected after reload')
      if (!(await page.isVisible('#info-page')))
        throw new Error('full info page not rendered after reload')
    } finally {
      await browser.close()
    }
  })

  server?.kill()
  results.push({ version, steps })
}

console.log('\n\n=== MATRIX RESULTS ===')
let anyFail = false
for (const { version, steps } of results) {
  console.log(`\nnuxt@${version}`)
  for (const [name, status] of Object.entries(steps)) {
    if (String(status).startsWith('FAIL'))
      anyFail = true
    console.log(`  ${name.padEnd(12)} ${status}`)
  }
}
process.exit(anyFail ? 1 : 0)
