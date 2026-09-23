<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const router = useParallelRouter('side')!
const lowerPath = ref('/item/1?q=lower')
const lowerRoute = computed(() => router.resolve(lowerPath.value))
const upperRoute = router.resolve('/item/2?q=upper')
const lateRoute = shallowRef<RouteLocationNormalizedLoaded>()
const dynamicProps = shallowRef<{ route?: RouteLocationNormalizedLoaded }>({})
</script>

<template>
  <div>
    <NuxtLink id="navigate" to="/item/10?q=next">
      Navigate
    </NuxtLink>
    <button id="update-lower" @click="lowerPath = '/item/4?q=updated'">
      Update lower route
    </button>
    <button id="set-late" @click="lateRoute = router.resolve('/item/3?q=late')">
      Set late route
    </button>
    <button id="clear-late" @click="lateRoute = undefined">
      Clear late route
    </button>
    <button id="set-dynamic" @click="dynamicProps = { route: router.resolve('/item/5?q=dynamic') }">
      Add route prop
    </button>
    <button id="clear-dynamic" @click="dynamicProps = {}">
      Remove route prop
    </button>
    <button id="show-fallback" @click="router.tryPush('/missing')">
      Show fallback
    </button>
    <button id="change-page-key" @click="lowerPath = '/item/4?q=keyed&viewKey=changed'">
      Change page key
    </button>

    <section id="global">
      <NuxtPage />
    </section>
    <section id="default">
      <PlusParallelPage name="side" />
    </section>
    <section id="default-sibling">
      <PlusParallelPage name="side" data-forwarded="yes" />
    </section>
    <section id="lower">
      <PlusParallelPage name="side" :route="lowerRoute" />
    </section>
    <section id="upper">
      <PlusParallelPage name="side" :route="upperRoute" />
    </section>
    <section id="late">
      <PlusParallelPage name="side" :route="lateRoute" />
    </section>
    <section id="dynamic">
      <PlusParallelPage name="side" v-bind="dynamicProps" />
    </section>
    <section id="fallback">
      <PlusParallelPage name="side" :route="lateRoute">
        <template #not-found>
          <RouteProbe class="fallback-probe" />
        </template>
      </PlusParallelPage>
    </section>
  </div>
</template>
