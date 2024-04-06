import { addComponent, addImports, addPlugin, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { extractNamedRoutePath } from './utils'

export default defineNuxtModule<{
  separator?: string
}>({
  meta: {
    name: 'nuxt-named-pages',
    configKey: 'namedPages',
  },
  defaults: {
    separator: '@',
  },
  setup(resolvedOptions, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    addComponent({
      name: 'NamedPage',
      filePath: resolver.resolve('./runtime/components/NamedPage.vue'),
      mode: 'all',
    })

    addImports([
      'useParentRouterName',
      'useParentRouter',
      'useParentRoute',
      'useNamedRouter',
      'resolveNamedRoutersByPath',
    ].map((name) => {
      return { name, from: resolver.resolve('runtime/composables') }
    }))

    const separator = resolvedOptions.separator ?? '@'

    addTemplate({
      filename: 'named-pages-config.mjs',
      getContents: () => `export default ${JSON.stringify({
        separator,
      })}`,
    })

    // fix that nuxt nested route does not have a name
    nuxt.hook('pages:extend', (pages) => {
      for (const page of pages) {
        if (extractNamedRoutePath(page.path, separator)) {
          if (!page.name)
            page.name = `__NAMEDPAGE__${page.path}`
        }
      }
    })
  },
})
