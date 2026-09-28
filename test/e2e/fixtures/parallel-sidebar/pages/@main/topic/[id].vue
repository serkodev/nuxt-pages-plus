<script setup lang="ts">
const route = useParentRoute()
</script>

<template>
  <div>
    <h2>main topic {{ route.params.id }}</h2>

    <output id="topic-query-foo">
      {{ route.query.foo }}
    </output>
  </div>
</template>
