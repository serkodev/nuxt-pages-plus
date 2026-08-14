<template>
  <Teleport to="body">
    <div class="modal-wrapper">
      <h2>slow modal</h2>

      <button @click="$modalRouter.close()">
        Close
      </button>
    </div>
  </Teleport>
</template>
