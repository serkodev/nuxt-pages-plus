<script setup lang="ts">
import type { NuxtLinkProps } from '#app'
import { NuxtLink } from '#components'
import { computed, useModalRouter } from '#imports'

const props = withDefaults(defineProps<NuxtLinkProps & {
  open?: boolean
}>(), {
  open: false,
})

const url = computed(() => props.to || props.href)

function onClick(e: MouseEvent) {
  if (!url.value || e.ctrlKey || e.shiftKey || e.metaKey || e.altKey)
    return

  e.preventDefault()

  const modalRouter = useModalRouter()
  if (props.replace) {
    modalRouter.replace(url.value)
  } else {
    modalRouter.push(url.value, props.open)
  }
}
</script>

<template>
  <NuxtLink v-bind="props" @click="onClick">
    <slot />
  </NuxtLink>
</template>
