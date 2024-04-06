<script setup lang="ts">
defineProps<{
  label: string
  color: string
}>()
</script>

<template>
  <div class="border border-dashed rounded relative" :style="{ borderColor: color }">
    <div class="absolute left-0 top-0 text-[9px] px-1 rounded-br rounded-tl-sm z-50 font-mono" :style="{ backgroundColor: color }">
      {{ label }}
    </div>
    <slot />
  </div>
</template>
