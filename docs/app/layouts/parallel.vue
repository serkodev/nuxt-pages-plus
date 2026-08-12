<script setup lang="ts">
const links = [
  { name: 'Home', path: '/examples/parallel-routes' },
  { name: 'Hot', path: '/examples/parallel-routes/hot' },
]

const router = useParallelRouter('left')

const relativePath = computed(() => {
  return useRoute().path.replace(/^\/examples\/parallel-routes/, '') || '/'
})
</script>

<template>
  <DocsPageLayout>
    <ExampleBrowser :path="relativePath">
      <div class="flex-1 grid grid-cols-[320px_1fr] gap-6">
        <div class="flex flex-col">
          <div class="flex gap-1 rounded-lg bg-elevated p-1 font-semibold self-start">
            <UButton
              v-for="link in links"
              :key="link.name"
              :to="link.path"
              size="sm"
              :color="link.path === router?.currentRoute.value.path ? 'primary' : 'neutral'"
              :variant="link.path === router?.currentRoute.value.path ? 'solid' : 'ghost'"
            >
              {{ link.name }}
            </UButton>
          </div>

          <PlusParallelPage name="left" />
        </div>
        <slot />
      </div>

      <template #toolbar-items>
        <UButton
          to="https://github.com/serkodev/nuxt-pages-plus/tree/main/docs/pages/examples/parallel-routes"
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
