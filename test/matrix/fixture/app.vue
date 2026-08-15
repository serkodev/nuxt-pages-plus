<script setup lang="ts">
// probe: reactive parallel route of the modal router, rendered for assertions
const modalRoute = useParallelRoute('modal')
const sideRouter = useParallelRouter('side')

// probe: every extracted parallel router; asserts `info@modal.vue` is
// reclaimed as a parallel route on Nuxt versions with native named views
const routerNames = Object.keys(useParallelRouters()).sort().join(',')
</script>

<template>
  <div>
    <nav>
      <NuxtLink id="link-topic" to="/topic/3?foo=f3">
        Topic 3
      </NuxtLink>
      <PlusModalLink id="link-info-modal" to="/info">
        Open info modal
      </PlusModalLink>
    </nav>

    <aside>
      <PlusParallelPage name="side">
        <template #index>
          <div id="side-index-slot">
            side index slot
          </div>
        </template>
        <template #not-found>
          <div id="side-not-found-slot">
            side not found slot
          </div>
        </template>
      </PlusParallelPage>
    </aside>

    <main>
      <PlusModalApp v-slot="{ route, layout }">
        <NuxtLayout :name="layout">
          <NuxtPage :route="route" />
        </NuxtLayout>
      </PlusModalApp>
    </main>

    <div id="modal-route-path" hidden>
      {{ modalRoute?.fullPath }}
    </div>
    <div id="side-router-name" hidden>
      {{ sideRouter?.name }}
    </div>
    <div id="router-names" hidden>
      [{{ routerNames }}]
    </div>
  </div>
</template>
