<script setup lang="ts">
// a client-side redirect awaited inside a hydrating async setup must not be
// held by the module's hydration navigation guard — the guard would deadlock
// against the very suspense this setup belongs to
if (import.meta.client) {
  await new Promise(resolve => setTimeout(resolve, 100))
  await navigateTo('/info')
}
</script>

<template>
  <div>
    <h1>redirect page</h1>
  </div>
</template>
