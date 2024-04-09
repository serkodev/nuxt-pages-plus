<script setup lang="ts">
import { NuxtPage } from '#components'

const props = defineProps(NuxtPage.props)
</script>

<template>
  <NuxtPage :route="$modalRouter.backgroundRoute.value || props.route" />
</template>
