<script setup lang="ts">
definePageMeta({
  name: 'topic',
})
</script>

<template>
  <TheBoundary label="topic/[id].vue" color="green">
    <UContainer>
      <h1 class="text-2xl font-semibold my-4">
        Topic {{ $route.params.id }}
      </h1>
      <p>
        This is the topic page.
      </p>
    </UContainer>
  </TheBoundary>
</template>
