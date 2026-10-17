import { spawn } from 'node:child_process'
import { lstat, readlink, symlink } from 'node:fs/promises'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
async function run(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, NUXT_TELEMETRY_DISABLED: '1' },
    })
    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (code === 0)
        resolve()
      else
        reject(new Error(`${command} failed (${signal || code})`))
    })
  })
}

async function main() {
  const example = process.argv[2] || 'modal-gallery'
  if (!['parallel-news', 'modal-gallery'].includes(example))
    throw new Error(`Unknown example: ${example}. Choose parallel-news or modal-gallery.`)

  const modules = new URL('../../node_modules', import.meta.url)
  const target = 'scripts/stackblitz/node_modules'
  const existing = await lstat(modules).catch((error) => {
    if (error.code !== 'ENOENT')
      throw error
  })

  if (existing && (!existing.isSymbolicLink() || await readlink(modules) !== target))
    throw new Error('This launcher needs a fresh StackBlitz checkout without an existing node_modules directory.')

  await run('npm', ['ci', '--prefix', 'scripts/stackblitz', '--legacy-peer-deps', '--no-audit', '--no-fund'])
  if (!existing)
    await symlink(target, modules, 'dir')

  const nuxt = 'scripts/stackblitz/node_modules/@nuxt/cli/bin/nuxi.mjs'
  await run(process.execPath, ['scripts/stackblitz/node_modules/@nuxt/module-builder/dist/cli.mjs', 'prepare'])
  await run(process.execPath, [nuxt, 'prepare', 'examples/base'])
  await run(process.execPath, [nuxt, 'build', `examples/${example}`])
  await run(process.execPath, [`examples/${example}/.output/server/index.mjs`])
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
})
