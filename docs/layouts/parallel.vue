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
          <div role="tablist" class="daisy-tabs daisy-tabs-boxed font-semibold">
            <NuxtLink
              v-for="link in links"
              :key="link.name"
              :to="link.path"
              role="tab"
              class="daisy-tab"
              :class="{ 'daisy-tab-active': link.path === router?.currentRoute.value.path }"
            >
              {{ link.name }}
            </NuxtLink>
          </div>

          <PlusParallelPage name="left" />
        </div>
        <slot />
      </div>

      <template #toolbar-items>
        <a href="https://github.com/serkodev/nuxt-pages-plus/tree/main/docs/pages/examples/parallel-routes" target="_blank">
          <button class="daisy-btn daisy-btn-xs text-nuxt">
            Source
          </button>
        </a>
      </template>
    </ExampleBrowser>
  </DocsPageLayout>
</template>
