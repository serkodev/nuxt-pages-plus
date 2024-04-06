import { addComponent, addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { extractNamedRoutePath } from './utils'

export default defineNuxtModule({
  meta: {
    name: 'nuxt-named-pages',
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
  },
  hooks: {
    'pages:extend': (pages) => {
      for (const page of pages) {
        if (extractNamedRoutePath(page.path)) {
          // fix that nuxt nested route does not have a name
          // when /@side/index.vue and /@side.vue both exist, the there will be two /@side, one of them without name and with children
          // when /@side.vue only, the there will be one /@side with name and children
          // when no /@side.vue, there will be not any route with children
          if (!page.name)
            page.name = `__NAMEDPAGE__${page.path}`
        }
      }
    },
  },
})
