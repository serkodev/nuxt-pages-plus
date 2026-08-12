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
        <UButton
          to="https://github.com/serkodev/nuxt-pages-plus/tree/main/docs/pages/examples/modal-routes"
          target="_blank"
          size="xs"
          color="neutral"
          variant="soft"
          class="text-nuxt"
        >
          Source
        </UButton>
      </template>
    </ExampleBrowser>
  </DocsPageLayout>
</template>
