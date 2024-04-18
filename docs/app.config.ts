// https://github.com/nuxt-themes/docus/blob/main/nuxt.schema.ts
export default defineAppConfig({
  docus: {
    title: 'Nuxt Pages Plus',
    description: 'A Nuxt module that enables complex routing for Nuxt Pages.',
    image: 'https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png',
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
