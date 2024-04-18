<script setup lang="ts">
const router = useRouter()
const page = computed({
  get: () => Number.parseInt(router.currentRoute.value.params.id as string) || 1,
  set: (val) => {
    router.push(`/examples/modal-routes/gallery/${val}`)
  },
})
</script>

<template>
  <div class="flex-1 flex">
    <TheBoundary label="$__PAGES_PATH__" class="flex-1 flex flex-col gap-8 justify-center items-center">
      <div class="font-bold text-2xl">
        This is the full detail page.
      </div>
      <div class="flex size-64 items-center justify-center text-[88px] bg-green-400 text-black rounded-2xl">
        {{ page }}
      </div>
      <ThePagination v-model="page" :total="9" />
      <NuxtLink to="/examples/modal-routes/">
        <button class="daisy-btn daisy-btn-primary">
          Go Index
        </button>
      </NuxtLink>
    </TheBoundary>
  </div>
</template>
