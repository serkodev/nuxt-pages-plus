<script setup lang="ts">
const route = useParentRoute()
</script>

<template>
  <h2>right topic {{ route.params.id }}</h2>
</template>
