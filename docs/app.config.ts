// https://github.com/nuxt-themes/docus/blob/main/nuxt.schema.ts
export default defineAppConfig({
  docus: {
    title: 'Nuxt Pages Plus',
    description: 'A Nuxt module that enables complex routing for Nuxt Pages.',
    image: 'https://nuxt-pages-plus.pages.dev/cover.png',
    socials: {
      github: 'serkodev/nuxt-pages-plus',
    },
    github: {
      dir: 'docs/content',
      branch: 'main',
      repo: 'nuxt-pages-plus',
      owner: 'serkodev',
      edit: true,
    },
    aside: {
      level: 0,
      collapsed: false,
      exclude: [],
    },
    main: {
      padded: true,
      fluid: true,
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      fluid: true,
    },
  },
})
