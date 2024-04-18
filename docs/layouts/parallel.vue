<script setup lang="ts">
const links = [
  { name: 'Home', path: '/examples/parallel-routes' },
  { name: 'Hot', path: '/examples/parallel-routes/hot' },
]

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
              exact-active-class="daisy-tab-active"
            >
              {{ link.name }}
            </NuxtLink>
          </div>

          <PlusParallelPage name="left">
            <template #index>
              <TheBoundary label="layouts/parallel.vue > PlusParallelPage #index" class="p-4">
                <p class="mb-4">
                  This is the index view of the @left parallel routes.
                </p>

                <p class="my-4">
                  The reason of rendering this view because when the page is init loaded but cannot find the match routes for <code class="text-nuxt">{{ relativePath }}</code>.
                </p>

                <p>
                  Instead of render this <code>#index</code> slot, you can set the <NuxtLink to="/getting-started/configuration#index">
                    <code class="text-nuxt">index</code>
                  </NuxtLink> in config, so it will redirect to the index page of the parallel routes.
                </p>
              </TheBoundary>
            </template>
          </PlusParallelPage>
        </div>
        <slot />
      </div>

      <template #toolbar-items>
        <a href="https://github.com/serkodev/nuxt-pages-plus/tree/docs/docs/pages/examples/parallel-routes" target="_blank">
          <button class="daisy-btn daisy-btn-xs text-nuxt">
            Source
          </button>
        </a>
      </template>
    </ExampleBrowser>
  </DocsPageLayout>
</template>
