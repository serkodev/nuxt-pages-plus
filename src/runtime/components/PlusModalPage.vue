<script setup lang="ts">
defineProps<{
  // Unique name of the parallel router
  name: string
}>()
</script>

<template>
  <PlusParallelPage :name hide-fallback v-bind="$attrs" />
</template>
