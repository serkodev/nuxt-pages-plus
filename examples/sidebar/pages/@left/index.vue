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
  <TheBoundary label="$__PAGES_PATH__" color="orange">
    <div class="px-2">
      <UVerticalNavigation :links="links" :ui="{ padding: 'px-3 py-3' }" />
    </div>
  </TheBoundary>
</template>
