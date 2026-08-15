<script setup lang="ts">
const route = useRoute()

// a single awaited fetch: after a refresh + back, purgeCachedData has dropped
// the cached entry, so a forward navigation re-fetches and keeps the
// navigation suspense pending for the round-trip duration
const { data } = await useFetch('/api/item', {
  key: `fetch-one-${route.params.id}`,
  query: { ms: 300 },
})
</script>

<template>
  <div>
    <h1>fetch-one page {{ $route.params.id }}</h1>

    <p>loaded: {{ data?.ok }}</p>

    <NuxtLink to="/">
      Go to index page
    </NuxtLink>
  </div>
</template>
