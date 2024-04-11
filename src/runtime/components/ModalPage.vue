<script setup lang="ts">
defineProps<{
  // Unique name of the parallel router
  name: string
}>()
</script>

<template>
  <ParallelPage :name auto-hide v-bind="$attrs" />
</template>
