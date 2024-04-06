<script setup lang="ts">
import { viewDepthKey } from 'vue-router'
import { NamedRouterSymbol } from '../symbols'
import { useNamedRouter } from '../composables'
import { computed, provide } from '#imports'

const props = defineProps<{
  name: string
}>()

provide(viewDepthKey, 0)
provide(NamedRouterSymbol, props.name)

const route = computed(() => useNamedRouter(props.name)?.currentRoute.value)
</script>

<template>
  <RouterView :route="route" />
</template>
