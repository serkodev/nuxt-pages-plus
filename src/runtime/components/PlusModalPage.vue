<script setup lang="ts">
import { NuxtPage } from '#components'
import { computed, useModalRouter } from '#imports'

const props = defineProps(NuxtPage.props)

const route = computed(() => useModalRouter().backgroundRoute.value || props.route)
</script>

<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <slot :route="route">
    <NuxtPage v-bind="{ ...$attrs, ...props, route }" />
  </slot>
</template>
