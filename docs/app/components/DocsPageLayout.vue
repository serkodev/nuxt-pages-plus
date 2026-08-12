<!--
  Shared wrapper for the interactive example pages (replaces the docus v1
  `DocsPageLayout` component). `data-theme` scopes the daisyui theme used by
  the demos and follows the site color mode.
-->
<script setup lang="ts">
const colorMode = useColorMode()

// resolve the theme only after mount: the color mode is unknown during SSR
// and Vue does not patch attribute mismatches on hydration
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
const theme = computed(() => mounted.value && colorMode.value === 'dark' ? 'dark' : 'light')
</script>

<template>
  <UContainer class="py-8" :data-theme="theme">
    <slot />
  </UContainer>
</template>
