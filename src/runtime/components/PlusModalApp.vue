<script setup lang="ts">
import type { NuxtPageProps, PageMeta } from '#app'
import { NuxtLayout, NuxtPage } from '#components'
import { computed, useModalRouter } from '#imports'

defineOptions({ inheritAttrs: false })

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
    <NuxtLayout :name="layout">
      <NuxtPage v-bind="{ ...$attrs, ...props, route }" />
    </NuxtLayout>
  </slot>
</template>
