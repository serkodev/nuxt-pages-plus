<script setup lang="ts">
const page = ref(Number.parseInt(useParentRoute().params.id as string) || 1)
const items = ref(Array(9))
const replaceNavigation = ref(false)

const parentRoute = useParentRoute()
const page = computed({
  get: () => Number.parseInt(parentRoute.params.id as string) || 1,
  set: (val) => {
    const modalRouter = useModalRouter()
    if (replaceNavigation.value) {
      modalRouter.replace(`/gallery/${val}`)
    } else {
      modalRouter.push(`/gallery/${val}`)
    }
  },
})

function handleChangeNavigation(index: number) {
  replaceNavigation.value = index === 1
}
</script>

<template>
  <div>
    <TheBoundary label="$__PAGES_PATH__" class="p-10 flex flex-col gap-8 justify-center items-center">
      <div class="flex size-64 items-center justify-center text-[88px] bg-green-400 text-black rounded-2xl">
        {{ useParentRoute().params.id }}
      </div>
      <UPagination v-model="page" :page-count="1" :total="items.length" />
      <div class="flex items-center gap-3 text-sm">
        Navigation
        <UTabs :items="[{ label: 'Push' }, { label: 'Replace' }]" :ui="{ wrapper: '!space-y-0' }" @change="handleChangeNavigation" />
      </div>
    </TheBoundary>
  </div>
</template>
