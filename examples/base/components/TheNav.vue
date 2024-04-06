<script setup lang="ts">
const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Bookmark',
    icon: 'i-heroicons-bookmark',
    to: '/bookmark',
  },
  {
    label: 'About',
    icon: 'i-heroicons-information-circle',
    to: '/about',
  },
]
</script>

<template>
  <UHorizontalNavigation :links class="px-2" />
</template>
