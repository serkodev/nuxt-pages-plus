<script setup lang="ts">
const items = ['/', 'test'].map((to) => {
  return {
    label: to,
    icon: 'i-lucide-star',
    to,
  }
})
</script>

<template>
  <ExampleView label="$__PAGES_PATH__">
    <div class="my-4">
      This router disabled sync and set <code>defaultPath</code> to <code>/foo</code>.
    </div>
    <UNavigationMenu orientation="vertical" :items="items" :ui="{ link: 'px-3 py-3' }" />
  </ExampleView>
</template>
