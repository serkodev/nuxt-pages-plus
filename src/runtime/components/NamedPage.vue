<script setup lang="ts">
import { viewDepthKey } from 'vue-router'
import { NamedRouterSymbol } from '../symbols'
import { useNamedRouter } from '../composables'
import { computed, inject, provide, unref } from '#imports'

const props = defineProps<{
  name: string
}>()

const parentRouterName = inject(NamedRouterSymbol, undefined)

const routerName = computed(() => {
  const name = unref(parentRouterName)
  return name ? `${name}/${props.name}` : props.name
})

provide(viewDepthKey, 0)
provide(NamedRouterSymbol, routerName)

const router = computed(() => useNamedRouter(routerName.value))
const route = computed(() => router.value?.currentRoute.value)
</script>

<template>
  <RouterView v-if="router" :route="route" v-bind="$attrs" />
</template>
