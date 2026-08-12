<script setup lang="ts">
const items = [1, 2, 3, 4, 5].map((i) => {
  return {
    label: `Topic ${i}`,
    icon: 'i-lucide-file',
    to: `/topic/${i}`,
  }
})
</script>

<template>
  <ExampleView label="$__PAGES_PATH__">
    <UNavigationMenu orientation="vertical" :items="items" :ui="{ link: 'px-3 py-3' }" />
  </ExampleView>
</template>
