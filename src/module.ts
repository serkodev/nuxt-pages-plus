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
    const options = defu(resolvedOptions, {
      separator: '@',
      parallelPages: {},
    } satisfies PagesPlusOptions)

    const resolver = createResolver(import.meta.url)

    addPlugin(resolver.resolve('./runtime/parallel-router'))
    addPlugin(resolver.resolve('./runtime/modal-router'))

    addTemplate({
      filename: 'nuxt-pages-plus-options.mjs',
      getContents: () => `export default ${JSON.stringify(options)}`,
    })

    addImportsDir(resolver.resolve('./runtime/composables'))

    addComponentsDir({ path: resolver.resolve('./runtime/components') })

    // fix that nuxt nested route does not have a name
    nuxt.hook('pages:extend', (pages) => {
      for (const page of pages) {
        if (extractParallelRoutePath(page.path, options.separator)) {
          if (!page.name)
            page.name = `__PAGES_PLUS__${page.path}`
        }
      }
    })
  },
})
