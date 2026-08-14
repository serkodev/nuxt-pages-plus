<script setup lang="ts">
import { useModalRouter } from '#imports'

// attrs are forwarded explicitly below, and the root renders nothing while
// the modal is closed
defineOptions({ inheritAttrs: false })

defineProps<{
  // Unique name of the parallel router
  name: string
}>()

// the parallel router is already synced to the target route while a navigation
// is still pending, but the page holding this outlet stays mounted until the
// target page's suspense resolves — so gate on the modal actually being open,
// or the modal view of a plain (modal-less) target entry would flash over the
// still-visible previous page
const { isOpen } = useModalRouter()
</script>

<template>
  <PlusParallelPage v-if="isOpen" :name hide-fallback v-bind="$attrs" />
</template>
