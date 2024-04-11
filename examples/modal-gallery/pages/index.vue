<script setup lang="ts">
const { push } = useModalRouter()
</script>

<template>
  <TheBoundary label="$__PAGES_PATH__" class="h-screen flex flex-col gap-6 items-center justify-center">
    <div class="grid grid-cols-3 gap-6">
      <button v-for="i in 9" :key="i" class="size-32 items-center justify-center text-4xl bg-green-400 text-black rounded-xl" @click="push(`/gallery/${i}`)">
        {{ i }}
      </button>
    </div>

    <UButton class="!bg-yellow-500" @click="push('/info')">
      Open Index Modal
    </UButton>

    <ModalPage name="modal" />
  </TheBoundary>
</template>
