<script setup lang="ts">
const router = useRouter()
const relativePath = computed(() => {
  return router.currentRoute.value.path.replace(/^\/examples\/modal-routes/, '') || '/'
})
</script>

<template>
  <DocsPageLayout>
    <ExampleBrowser :path="relativePath" class="!relative">
      <slot />

      <template #toolbar-items>
        <a href="https://github.com/serkodev/nuxt-pages-plus/tree/docs/docs/pages/examples/modal-routes" target="_blank">
          <button class="daisy-btn daisy-btn-xs text-nuxt">
            Source
          </button>
        </a>
      </template>
    </ExampleBrowser>
  </DocsPageLayout>
</template>
