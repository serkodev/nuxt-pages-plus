<script setup lang="ts">
definePageMeta({
  key: route => String(route.query.viewKey ?? 'same'),
})
</script>

<template>
  <div>
    <RouteProbe class="side-probe" />
    <div class="child">
      <PlusParallelPage name="child" />
    </div>
  </div>
</template>
