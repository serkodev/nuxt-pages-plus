<script setup lang="ts">
const page = ref(Number.parseInt(useParentRoute().params.id as string) || 1)
const items = ref(Array(9))

watch(page, (page) => {
  useModalRouter().push(`/gallery/${page}`)
})
</script>

<template>
  <div>
    <TheBoundary label="$__PAGES_PATH__" class="p-10 flex flex-col gap-8 justify-center items-center">
      <div class="flex size-64 items-center justify-center text-[88px] bg-green-400 text-black rounded-2xl">
        {{ useParentRoute().params.id }}
      </div>
      <UPagination v-model="page" :page-count="1" :total="items.length" />
    </TheBoundary>
  </div>
</template>
