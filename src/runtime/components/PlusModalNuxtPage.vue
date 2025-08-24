<script setup lang="ts">
import type { NuxtPageProps } from '#app'
import { NuxtPage } from '#components'
import { computed, useModalRouter } from '#imports'

const props = defineProps<NuxtPageProps>()

const { route: modalRoute, layout } = useModalRouter()

const route = computed(() => (modalRoute.value || props.route) as NuxtPageProps['route'])
</script>

<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <slot :route="route" :layout="layout">
    <NuxtPage v-bind="{ ...$attrs, ...props, route }" />
  </slot>
</template>
