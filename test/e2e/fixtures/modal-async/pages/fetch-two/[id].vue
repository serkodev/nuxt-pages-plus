<script setup lang="ts">
const route = useRoute()

// two sequentially awaited fetches: the real-world shape of the reported
// flash — the suspense stays pending for the combined round trips
const { data: first } = await useFetch('/api/item', {
  key: `fetch-two-first-${route.params.id}`,
  query: { ms: 200, part: 'first' },
})
const { data: second } = await useFetch('/api/item', {
  key: `fetch-two-second-${route.params.id}`,
  query: { ms: 200, part: 'second' },
})
</script>

<template>
  <div>
    <h1>fetch-two page {{ $route.params.id }}</h1>

    <p>loaded: {{ first?.ok }} {{ second?.ok }}</p>

    <NuxtLink to="/">
      Go to index page
    </NuxtLink>
  </div>
</template>
