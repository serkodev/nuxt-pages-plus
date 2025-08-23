<script setup lang="ts">
import type { PagesPlusOptions } from '../types'
import pagesPlusOptions from '#build/nuxt-pages-plus-options.mjs'
import { computed, inject, provide, unref, useParallelRouter } from '#imports'
import { viewDepthKey } from 'vue-router'
import { ParallelRouterSymbol } from '../symbols'

const props = defineProps<{
  // Unique name of the parallel router
  name: string

  // Hide view when fallback
  hideFallback?: boolean

  // Name of the router view to use
  routerViewName?: string
}>()

const slots = defineSlots<{
  'not-found': () => any
  'index': () => any
}>()

const { experimental } = pagesPlusOptions as unknown as PagesPlusOptions

const parentRouterName = inject(ParallelRouterSymbol, undefined)

const routerName = computed(() => {
  const name = unref(parentRouterName)
  return name ? `${name}/${props.name}` : props.name
})

provide(viewDepthKey, 0)
provide(ParallelRouterSymbol, routerName)

const router = computed(() => useParallelRouter(routerName.value))
const route = computed(() => router.value?.currentRoute.value)

const routerKey = experimental?.parallelPageMetaKey
  ? computed(() => {
      if (!route.value)
        return

      const source = route.value?.meta.key
      return typeof source === 'function' ? source(route.value) : undefined
    })
  : undefined

const fallbackSlot = computed(() => {
  if (props.hideFallback)
    return

  return (router.value?.fallback.notFound && slots['not-found'])
    || (router.value?.fallback.index && slots.index)
})

const hide = computed(() => {
  return props.hideFallback && (router.value?.fallback.index || router.value?.fallback.notFound)
})
</script>

<template>
  <div v-if="fallbackSlot">
    <component :is="fallbackSlot" />
  </div>
  <RouterView
    v-else-if="router && !hide"
    :key="routerKey"
    :name="routerViewName"
    :route="route"
    v-bind="$attrs"
  />
</template>
