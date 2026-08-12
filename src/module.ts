import type { PagesPlusOptions } from './runtime/types'
import { addComponentsDir, addImportsDir, addPlugin, addTemplate, createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import { restoreParallelPages } from './named-views'
import { extractParallelRoutePath } from './runtime/utils'

export default defineNuxtModule<PagesPlusOptions>({
  meta: {
    name: 'nuxt-pages-plus',
    configKey: 'pagesPlus',
    compatibility: {
      // oldest version the compatibility matrix (test/matrix) is verified against
      nuxt: '>=3.16.0',
    },
  },
  defaults: {
    separator: '@',
    parallelPages: {},
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    addPlugin(resolver.resolve('./runtime/parallel-router'))
    addPlugin(resolver.resolve('./runtime/modal-router'))

    addTemplate({
      filename: 'nuxt-pages-plus-options.mjs',
      getContents: () => `export default ${JSON.stringify(options)}`,
    })

    addImportsDir(resolver.resolve('./runtime/composables'))

    addComponentsDir({ path: resolver.resolve('./runtime/components') })

    nuxt.hook('pages:extend', (pages) => {
      // reclaim `name@view.vue` files from Nuxt's native named views (Nuxt >= 4.5)
      restoreParallelPages(pages, options, () => {
        useLogger('nuxt-pages-plus').warn(
          'Nuxt now treats `name@view.vue` page files as vue-router named views. '
          + 'Set `pagesPlus.namedViewsAsParallelRoutes: true` to keep using them as parallel routes, '
          + 'or set it to `false` to dismiss this warning.',
        )
      })

      // fix that nuxt nested route does not have a name
      for (const page of pages) {
        if (extractParallelRoutePath(page.path, options.separator)) {
          if (!page.name)
            page.name = `__PAGES_PLUS__${page.path}`
        }
      }
    })

    // remove parallel routes from prerender routes
    nuxt.hook('prerender:routes', ({ routes }) => {
      for (const route of Array.from(routes)) {
        if (extractParallelRoutePath(route, options.separator)) {
          routes.delete(route)
        }
      }
    })
  },
})
