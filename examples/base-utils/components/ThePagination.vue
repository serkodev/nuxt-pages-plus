<script setup lang="ts">
defineProps<{
  total: number
}>()
const page = defineModel<number>({ default: 1 })
</script>

<template>
  <!-- one item per page and a large sibling count so every page button stays visible -->
  <UPagination
    v-model:page="page"
    :total="total"
    :items-per-page="1"
    :sibling-count="total"
    size="sm"
  />
</template>
