<template>
  <Teleport to="body">
    <div class="modal-wrapper">
      <TheBoundary label="$__PAGES_PATH__" class="w-full h-full flex flex-col gap-4 items-center justify-center">
        <ExampleView color="gray">
          <UButton @click="$modalRouter.close()">
            Close
          </UButton>
        </ExampleView>
      </TheBoundary>
    </div>
  </Teleport>
</template>
