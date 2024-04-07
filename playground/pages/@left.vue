<script setup lang="ts">
const links = ['/', 'test'].map((to) => {
  return {
    label: to,
    icon: 'i-heroicons-star',
    to,
  }
})
</script>

<template>
  <TheBoundary label="$__PAGES_PATH__" color="orange">
    <div class="px-4">
      <h3 class="text-lg font-semibold my-4">
        Left Sidebar of Index
      </h3>
      <UVerticalNavigation :links="links" :ui="{ padding: 'px-3 py-3' }" />
    </div>
  </TheBoundary>
</template>
