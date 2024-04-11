<template>
  <TheBoundary label="$__PAGES_PATH__" class="h-screen flex flex-col gap-6 items-center justify-center">
    <div class="grid grid-cols-3 gap-6">
      <PlusModalLink v-for="i in 9" :key="i" :to="`/gallery/${i}`">
        <button class="size-32 items-center justify-center text-4xl bg-green-400 text-black rounded-xl">
          {{ i }}
        </button>
      </PlusModalLink>
    </div>

    <PlusModalLink to="/info/1">
      <UButton class="!bg-yellow-500">
        Open Info
      </UButton>
    </PlusModalLink>

    <PlusModalPage name="modal" />
  </TheBoundary>
</template>
