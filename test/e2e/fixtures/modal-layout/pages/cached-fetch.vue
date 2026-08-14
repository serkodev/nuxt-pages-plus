<script setup lang="ts">
definePageMeta({
  layout: 'blue',
})

// standard useFetch: hydration reuses the SSR payload, so the fetch never
// delays hydration and there is no pending window for a back press to hit
const { data } = await useFetch('/api/item', {
  query: { ms: 300 },
})
</script>

<template>
  <div>
    <h1>cached-fetch page</h1>

    <p>loaded: {{ data?.ok }}</p>

    <NuxtLink to="/">
      Go to index page
    </NuxtLink>
  </div>
</template>
