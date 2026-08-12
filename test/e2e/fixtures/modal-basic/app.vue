<script setup lang="ts">
// probe: renders the reactive parallel route so tests can assert it tracks navigation
const modalRoute = useParallelRoute('modal')
</script>

<template>
  <div>
    <PlusModalNuxtPage />
    <div id="modal-route-path" hidden>
      {{ modalRoute?.fullPath }}
    </div>
  </div>
</template>
