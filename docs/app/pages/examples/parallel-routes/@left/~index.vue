<script setup lang="ts">
const relativePath = computed(() => {
  return useRoute().path.replace(/^\/examples\/parallel-routes/, '') || '/'
})
</script>

<template>
  <TheBoundary label="$__PAGES_PATH__" class="p-4">
    <p class="mb-4">
      This is the index view of the @left parallel routes.
    </p>

    <p class="my-4">
      The reason of rendering this view because when the page is init loaded but cannot find the match routes for <code class="text-nuxt">{{ relativePath }}</code>.
    </p>

    <p>
      Instead of render this <code class="text-nuxt">/~index</code> path, you can set the <NuxtLink to="/getting-started/configuration#index">
        <code class="text-nuxt underline">index</code>
      </NuxtLink> in config, so it will redirect to the index page of the parallel routes.
    </p>
  </TheBoundary>
</template>
