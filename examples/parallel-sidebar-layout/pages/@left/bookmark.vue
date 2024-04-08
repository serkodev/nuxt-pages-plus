<script setup lang="ts">
const links = [6, 7, 8].map((i) => {
  return {
    label: `Topic ${i}`,
    icon: 'i-heroicons-star',
    to: `/topic/${i}`,
  }
})
</script>

<template>
  <ExampleView label="$__PAGES_PATH__">
    <UVerticalNavigation :links="links" :ui="{ padding: 'px-3 py-3' }" />
  </ExampleView>
</template>
