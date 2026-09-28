<script setup lang="ts">
// the router of the nearest PlusParallelPage outlet, if any
const name = useParallelRouter()?.name ?? 'global'
const route = useParentRoute()
</script>

<template>
  <p class="router-probe">
    {{ name }}:{{ route.path }}
  </p>
</template>
