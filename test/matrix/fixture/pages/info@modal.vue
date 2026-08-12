<script setup lang="ts">
const modalRouter = useModalRouter()
</script>

<template>
  <div class="modal-wrapper">
    <h2 id="info-modal">
      info modal
    </h2>
    <button id="close-modal" type="button" @click="modalRouter.close()">
      Close
    </button>
  </div>
</template>
