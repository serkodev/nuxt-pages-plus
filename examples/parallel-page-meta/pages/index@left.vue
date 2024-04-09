<script setup lang="ts">
definePageMeta({
  parallel: {
    name: 'my-left',
  },
})
</script>

<template>
  <ExampleView label="$__PAGES_PATH__">
    This route name is <code>my-left</code> and it is overriden by <code>parallel.override.name</code> page meta.
  </ExampleView>
</template>
