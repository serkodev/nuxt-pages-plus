<script setup lang="ts">
const links = [1, 2, 3, 4, 5].map((i) => {
  return {
    label: `Topic ${i}`,
    icon: 'i-heroicons-document',
    to: `/topic/${i}`,
  }
})
</script>

<template>
  <ExampleView label="$__PAGES_PATH__">
    <UVerticalNavigation :links="links" :ui="{ padding: 'px-3 py-3' }" />
  </ExampleView>
</template>
