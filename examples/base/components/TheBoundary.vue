<script setup lang="ts">
const props = defineProps<{
  label: string
  color?: string
}>()

const colors = [
  'red',
  'orange',
  'green',
  'blue',
  'indigo',
  'purple',
]

// base on the label content, auto caculate select color
const color = computed(() => {
  if (props.color)
    return props.color
  const index = props.label.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
})
</script>

<template>
  <div class="border border-dashed rounded relative" :style="{ borderColor: color }">
    <div class="absolute left-0 top-0 text-[9px] px-1 rounded-br rounded-tl-sm z-50 font-mono text-white" :style="{ backgroundColor: color }">
      {{ label }}
    </div>
    <slot />
  </div>
</template>
