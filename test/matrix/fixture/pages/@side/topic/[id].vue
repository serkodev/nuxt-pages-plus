<script setup lang="ts">
const route = useParentRoute()
</script>

<template>
  <div>
    <h2 id="side-topic">
      side topic id:{{ route.params.id }} foo:{{ route.query.foo }}
    </h2>
  </div>
</template>
