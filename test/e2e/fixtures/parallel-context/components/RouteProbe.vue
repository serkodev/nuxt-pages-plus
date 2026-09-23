<script setup lang="ts">
const route = useParentRoute()
const shared = route === (useParallelRoute() ?? useRoute())
const stable = route === useParentRoute()
</script>

<template>
  <p :data-shared="shared" :data-stable="stable">
    {{ route.params.id }}:{{ route.query.q }}
  </p>
</template>
