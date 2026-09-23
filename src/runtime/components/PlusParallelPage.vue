<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { PagesPlusOptions } from '../types'
import { viewDepthKey } from 'vue-router'
import pagesPlusOptions from '#build/nuxt-pages-plus-options.mjs'
import { computed, inject, provide, unref, useParallelRouter } from '#imports'
import { ParallelRouterSymbol, ParallelRouteSymbol } from '../symbols'

const props = defineProps<{
  // Unique name of the parallel router
  name: string

  // Hide view when fallback
  hideFallback?: boolean

  // Name of the router view to use
  routerViewName?: string

  // Render this route instead of the parallel router's current (top) route.
  // Enables rendering a specific entry of a parallel stack — e.g. a lower layer
  // of an N-deep modal stack rendered behind the top one.
  route?: RouteLocationNormalizedLoaded
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
const renderRoute = computed(() => props.route ?? router.value?.currentRoute.value)

// expose the route this page is rendering so descendants read it via
// `useParentRoute()` instead of the parallel router's shared current (top) route
provide(ParallelRouteSymbol, renderRoute)

const routerKey = experimental?.parallelPageMetaKey
  ? computed(() => {
      if (!renderRoute.value)
        return

      const source = renderRoute.value?.meta.key
      return typeof source === 'function' ? source(renderRoute.value) : undefined
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
    :route="renderRoute"
    v-bind="$attrs"
  />
</template>
