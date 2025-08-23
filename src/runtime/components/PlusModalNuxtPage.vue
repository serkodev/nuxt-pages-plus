<script setup lang="ts">
import type { NuxtPageProps } from '#app'
import { NuxtPage } from '#components'
import { computed, useModalRouter } from '#imports'
import { useRoute } from 'vue-router'

const props = defineProps<NuxtPageProps>()

const { backgroundRoute } = useModalRouter()

const route = computed(() => (backgroundRoute.value || props.route) as NuxtPageProps['route'])

const globalRoute = useRoute()

const layout = computed(() => {
  if (route.value) {
    return route.value.meta.layout || 'default'
  }
  return globalRoute.meta.layout || 'default'
})
</script>

<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <slot :route="route" :layout="layout">
    <NuxtPage v-bind="{ ...$attrs, ...props, route }" />
  </slot>
</template>
