<script setup lang="ts">
definePageMeta({
  layout: 'blue',
})
</script>

<template>
  <TheBoundary label="$__PAGES_PATH__" class="h-screen flex flex-col gap-2 items-center justify-center">
    <NuxtLink to="/">
      <UButton>
        Go to index page
      </UButton>
    </NuxtLink>
  </TheBoundary>
</template>
