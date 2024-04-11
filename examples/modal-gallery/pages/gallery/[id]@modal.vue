<script setup lang="ts">
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
  <Teleport to="body">
    <div class="modal-wrapper">
      <TheBoundary label="$__PAGES_PATH__" class="w-full h-full flex items-center justify-center">
        <div class="border border-gray-800 p-6 rounded-lg space-y-3">
          <div>
            <p>After refresh this page, the gallery id page will show up in full page.</p>
            <p>You can use browser's back / next to navigate.</p>
          </div>

          <div class="flex flex-col items-center gap-4 py-4">
            <div class="flex size-64 items-center justify-center text-[88px] bg-green-400 text-black rounded-2xl">
              {{ useParentRoute().params.id }}
            </div>
            <UPagination v-model="page" :page-count="1" :total="items.length" />
          </div>
          <div class="flex items-center gap-3 text-sm">
            Navigation
            <UTabs :items="[{ label: 'Push' }, { label: 'Replace' }]" :ui="{ wrapper: '!space-y-0' }" @change="handleChangeNavigation" />
          </div>
          <div class="flex items-center gap-3 text-sm">
            PlusModalLink
            <PlusModalLink to="/gallery/9" class="text-red-500" :replace="replaceNavigation">
              <UButton>Go Last</UButton>
            </PlusModalLink>
          </div>
          <div class="flex items-center gap-3 text-sm">
            PlusModalLink new
            <PlusModalLink new-group to="/gallery/9" class="text-red-500">
              <UButton>new group</UButton>
            </PlusModalLink>
          </div>

          <UButton class="!bg-blue-500" @click="$modalRouter.close()">
            Close
          </UButton>
        </div>
      </TheBoundary>
    </div>
  </Teleport>
</template>
