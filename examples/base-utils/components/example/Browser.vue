<script setup lang="ts">
defineProps<{
  path?: string
}>()
</script>

<template>
  <div class="daisy-mockup-browser border border-base-300">
    <div class="daisy-mockup-browser-toolbar">
      <div class="daisy-input border border-base-300">
        <span class="opacity-50">https://example.com</span><span class="text-nuxt font-semibold">{{ path ?? '/' }}</span>
      </div>
      <slot name="toolbar-items" />
    </div>

    <div class="border-t border-base-300 p-8 min-h-[calc(100vh-180px)] relative flex">
      <slot />
    </div>
  </div>
</template>
