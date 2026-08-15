<script setup lang="ts">
// simulate a slow data dependency: the async setup keeps the navigation's
// suspense pending, so the previously displayed page stays mounted meanwhile
await new Promise(resolve => setTimeout(resolve, 800))
</script>

<template>
  <div>
    <h1>gallery page {{ $route.params.id }}</h1>

    <p>This is the full detail page.</p>

    <NuxtLink to="/">
      Go to index page
    </NuxtLink>
  </div>
</template>
