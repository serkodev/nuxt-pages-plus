<script setup lang="ts">
import { viewDepthKey } from 'vue-router'
import { ParallelRouterSymbol } from '../symbols'
import { computed, inject, provide, unref, useParallelRouter } from '#imports'

const props = defineProps<{
  // Unique name of the parallel router
  name: string

  // Disable rendering during soft navigation
  autoHide?: boolean

  // Name of the router view to use
  routerViewName?: string
}>()

const parentRouterName = inject(ParallelRouterSymbol, undefined)

const routerName = computed(() => {
  const name = unref(parentRouterName)
  return name ? `${name}/${props.name}` : props.name
})

provide(viewDepthKey, 0)
provide(ParallelRouterSymbol, routerName)

const router = computed(() => useParallelRouter(routerName.value))
const route = computed(() => router.value?.currentRoute.value)
</script>

<template>
  <RouterView
    v-if="router && (!props.autoHide || !router.inSoftNavigation.value)"
    :name="routerViewName"
    :route="route"
    v-bind="$attrs"
  />
</template>
