<script setup lang="ts">
defineProps<{
  path?: string
}>()
</script>

<template>
  <div class="rounded-xl border border-default bg-default overflow-hidden">
    <div class="flex items-center gap-4 px-4 py-3">
      <div class="flex gap-1.5">
        <span class="size-3 rounded-full bg-red-400" />
        <span class="size-3 rounded-full bg-amber-400" />
        <span class="size-3 rounded-full bg-green-400" />
      </div>
      <div class="flex-1 max-w-xl mx-auto rounded-full border border-default bg-elevated px-4 py-1.5 text-sm truncate">
        <span class="opacity-50">https://example.com</span><span class="text-nuxt font-semibold">{{ path ?? '/' }}</span>
      </div>
      <slot name="toolbar-items" />
    </div>

    <div class="border-t border-default p-8 min-h-[calc(100vh-180px)] relative flex">
      <slot />
    </div>
  </div>
</template>
