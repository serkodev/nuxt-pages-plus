<script setup lang="ts">
import type { NuxtPageProps, PageMeta } from '#app'
import { NuxtPage } from '#components'
import { computed, useModalRouter } from '#imports'

const props = defineProps<NuxtPageProps>()

defineSlots<{
  default?: (props: {
    route: NuxtPageProps['route']
    layout: PageMeta['layout']
  }) => any
}>()

const { route: modalRoute, layout } = useModalRouter()

const route = computed(() => (modalRoute.value || props.route) as NuxtPageProps['route'])
</script>

<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <slot :route="route" :layout="layout">
    <NuxtPage v-bind="{ ...$attrs, ...props, route }" />
  </slot>
</template>
