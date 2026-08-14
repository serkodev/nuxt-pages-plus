<script setup lang="ts">
definePageMeta({
  layout: 'blue',
})

// simulate slow client-side work during hydration only: keeps the reloaded
// page hydrating (so a browser back lands in the pending window) without
// slowing down the SPA navigation that merely sets up history
if (import.meta.client && useNuxtApp().isHydrating)
  await new Promise(resolve => setTimeout(resolve, 1500))
</script>

<template>
  <div>
    <h1>slow page</h1>

    <NuxtLink to="/">
      Go to index page
    </NuxtLink>
  </div>
</template>
