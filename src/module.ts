import { addComponentsDir, addImports, addImportsDir, addPlugin, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'
import { extractParallelRoutePath } from './runtime/utils'
import type { PagesPlusOptions } from './runtime/types'

export default defineNuxtModule<Partial<PagesPlusOptions>>({
  meta: {
    name: 'nuxt-pages-plus',
    configKey: 'pagesPlus',
  },
  setup(resolvedOptions, nuxt) {
    if (resolvedOptions?.parallel === false)
      return

    const parallel = defu(resolvedOptions.parallel, {
      separator: '@',
      pages: {},
    } satisfies PagesPlusOptions['parallel'])

    const resolver = createResolver(import.meta.url)

    addPlugin(resolver.resolve('./runtime/parallel-router'))
    addPlugin(resolver.resolve('./runtime/modal-router'))

    addTemplate({
      filename: 'parallel-pages-config.mjs',
      getContents: () => `export default ${JSON.stringify(parallel)}`,
    })

    addImportsDir(resolver.resolve('./runtime/composables'))

    addComponentsDir({ path: resolver.resolve('./runtime/components') })

    // fix that nuxt nested route does not have a name
    nuxt.hook('pages:extend', (pages) => {
      for (const page of pages) {
        if (extractParallelRoutePath(page.path, parallel.separator)) {
          if (!page.name)
            page.name = `__PAGES_PLUS__${page.path}`
        }
      }
    })
  },
})
