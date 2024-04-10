<script setup lang="ts">
const { isOpen, open, close } = useModalRouter()
</script>

<template>
  <TheBoundary label="$__PAGES_PATH__" class="h-screen flex items-center justify-center">
    <div class="grid grid-cols-3 gap-6">
      <button v-for="i in 9" :key="i" class="size-32 items-center justify-center text-4xl bg-green-400 text-black rounded-xl" @click="open(`/gallery/${i}`)">
        {{ i }}
      </button>
    </div>

    <Teleport v-if="isOpen" to="body">
      <div class="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
        <div class="border border-gray-800 p-6 rounded-lg space-y-3 backdrop-blur dark:bg-black/75 bg-white/75">
          <div>After you refresh this page, the contacts id page will show up in full page.</div>
          <div>You can use browser's back / next to navigate too.</div>
          <ParallelPage name="modal" />
          <UButton @click="close">
            Close
          </UButton>
        </div>
      </div>
    </Teleport>
  </TheBoundary>
</template>
