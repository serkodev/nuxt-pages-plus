<script setup lang="ts">
const route = useRoute()

// awaited useFetch: a post-hydration navigation towards this page keeps the
// suspense pending for the round trip (after refresh + back the cached entry
// was purged), so the previously displayed page stays mounted meanwhile
const { data } = await useFetch('/api/item', {
  query: { ms: 800, page: route.params.id },
})
</script>

<template>
  <div>
    <h1>gallery page {{ $route.params.id }}</h1>

    <p>This is the full detail page. loaded: {{ data?.ok }}</p>

    <NuxtLink to="/">
      Go to index page
    </NuxtLink>
  </div>
</template>
