<script setup lang="ts">
const navigation = [{
  title: 'Examples',
  path: '#examples',
  icon: 'i-lucide-app-window',
  children: [
    {
      title: 'Parallel News',
      path: 'https://stackblitz.com/github/serkodev/nuxt-pages-plus?startScript=stackblitz%3Aparallel-news&file=examples%2Fparallel-news%2Fpages%2Findex.vue',
      target: '_blank',
    },
    {
      title: 'Modal Gallery',
      path: 'https://stackblitz.com/github/serkodev/nuxt-pages-plus?startScript=stackblitz%3Amodal-gallery&file=examples%2Fmodal-gallery%2Fpages%2Findex.vue',
      target: '_blank',
    },
  ],
}]
</script>

<template>
  <UContentNavigation
    :navigation="navigation"
    :collapsible="false"
    class="mt-6"
    aria-label="Examples"
  />
</template>
