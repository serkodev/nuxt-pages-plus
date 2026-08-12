export default defineAppConfig({
  seo: {
    title: 'Nuxt Pages Plus',
    titleTemplate: '%s · Nuxt Pages Plus',
    description: 'A Nuxt module that enables complex routing for Nuxt Pages.',
  },
  header: {
    title: 'Nuxt Pages Plus',
    logo: {
      light: '/logo.svg',
      dark: '/logo.svg',
      alt: 'Nuxt Pages Plus',
    },
  },
  github: {
    owner: 'serkodev',
    name: 'nuxt-pages-plus',
    url: 'https://github.com/serkodev/nuxt-pages-plus',
    branch: 'main',
    rootDir: 'docs',
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'zinc',
    },
  },
})
