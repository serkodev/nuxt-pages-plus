<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <TheBoundary label="$__PAGES_PATH__" class="flex-1 flex flex-col gap-6 items-center justify-center">
    <div class="grid grid-cols-3 gap-6">
      <PlusModalLink v-for="i in 9" :key="i" :to="`/examples/modal-routes/gallery/${i}`">
        <button class="size-32 items-center justify-center text-4xl bg-green-400 text-black rounded-xl">
          {{ i }}
        </button>
      </PlusModalLink>
    </div>

    <PlusModalLink to="/examples/modal-routes/info/1">
      <button class="daisy-btn daisy-btn-primary">
        Open Info
      </button>
    </PlusModalLink>
  </TheBoundary>
  <PlusModalPage name="modal" />
</template>
