<script setup lang="ts">
// the modal awaits the page's FIRST fetch (same key → deduped), like a real
// app where modal and standalone page show the same record: the modal becomes
// ready one round trip before the standalone page, so without the isOpen gate
// it pops up over the previous page while the second fetch is still pending
const route = useRoute()
const { data } = await useFetch('/api/item', {
  key: `fetch-two-first-${route.params.id}`,
  query: { ms: 200, part: 'first' },
})
</script>

<template>
  <div class="modal-wrapper">
    <h2>fetch-two modal</h2>
    <p>loaded: {{ data?.ok }}</p>

    <button @click="$modalRouter.close()">
      Close
    </button>
  </div>
</template>
