<template>
  <Teleport to="body">
    <div class="modal-wrapper">
      <TheBoundary label="$__PAGES_PATH__" class="w-full h-full flex flex-col gap-4 items-center justify-center">
        <code>info@modal.vue</code>

        <UButton @click="$modalRouter.close()">
          Close
        </UButton>
      </TheBoundary>
    </div>
  </Teleport>
</template>
