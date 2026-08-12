import process from 'node:process'
import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule<{
  basedPath: string | RegExp
}>({
  meta: {
    name: 'pages-path',
    configKey: 'pagesPath',
  },
  defaults: {
    basedPath: '/pages/',
  },
  setup(resolvedOptions) {
    const MAGIC_COMMENT = '$__PAGES_PATH__'

    addVitePlugin({
      name: 'pages-path',
      enforce: 'pre',
      async transform(code, id) {
        if (!code.includes(MAGIC_COMMENT))
          return

        let filePath = id
        const cwd = process.cwd()
        if (id.indexOf(cwd) === 0) {
          filePath = id.slice(cwd.length)
        }

        // find the first '/pages/' and remove everything before it
        const targetString = resolvedOptions.basedPath
        if (targetString instanceof RegExp) {
          const match = filePath.match(targetString)
          if (match && match.index) {
            const pagesPath = filePath.slice(match.index + match[0].length)
            return code.replaceAll(MAGIC_COMMENT, pagesPath)
          }
        } else {
          const pagesIndex = filePath.indexOf(targetString)
          if (pagesIndex !== -1) {
            const pagesPath = filePath.slice(pagesIndex + targetString.length)
            return code.replaceAll(MAGIC_COMMENT, pagesPath)
          }
        }

        return code
      },
    })
  },
})
