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
  <ExampleView label="$__PAGES_PATH__">
    <div class="my-4">
      This router disabled sync and set <code>defaultPath</code> to <code>/foo</code>.
    </div>
    <UVerticalNavigation :links="links" :ui="{ padding: 'px-3 py-3' }" />
  </ExampleView>
</template>
