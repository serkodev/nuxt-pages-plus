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
  <TheBoundary label="@left/bookmark.vue" color="blue">
    <div class="px-2">
      <UVerticalNavigation :links="links" :ui="{ padding: 'px-3 py-3' }" />
    </div>
  </TheBoundary>
</template>
