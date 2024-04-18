<script setup lang="ts">
const replaceNavigation = ref(false)

const router = useRouter()
const page = computed({
  get: () => Number.parseInt(router.currentRoute.value.params.id as string) || 1,
  set: (val) => {
    useModalRouter().push(`/examples/modal-routes/gallery/${val}`)
  },
})
</script>

<template>
  <div class="modal-wrapper !absolute">
    <TheBoundary label="$__PAGES_PATH__" class="w-full h-full flex items-center justify-center">
      <div class="border border-gray-800 p-6 rounded-lg space-y-3">
        <div>
          <p>After refresh this page, the gallery id page will show up in full page.</p>
          <p>You can use browser's back / next to navigate.</p>
        </div>

        <div class="flex flex-col items-center gap-4 py-4">
          <div class="flex size-64 items-center justify-center text-[88px] bg-green-400 text-black rounded-2xl">
            {{ page }}
          </div>
          <ThePagination v-model="page" :total="9" />
        </div>
        <div class="flex items-center gap-3 text-sm">
          Navigation

          <div role="tablist" class="daisy-tabs daisy-tabs-boxed">
            <a role="tab" class="daisy-tab" :class="!replaceNavigation && 'daisy-tab-active'" @click.prevent="replaceNavigation = false">Push</a>
            <a role="tab" class="daisy-tab" :class="replaceNavigation && 'daisy-tab-active'" @click.prevent="replaceNavigation = true">Replace</a>
          </div>
        </div>
        <div class="flex items-center gap-3 text-sm">
          PlusModalLink
          <PlusModalLink to="/examples/modal-routes/gallery/9" class="text-red-500" :replace="replaceNavigation">
            <button class="daisy-btn daisy-btn-sm daisy-btn-primary">
              Go Last
            </button>
          </PlusModalLink>
          <PlusModalLink to="/examples/modal-routes/info/1" class="text-red-500">
            <button class="daisy-btn daisy-btn-sm daisy-btn-primary">
              Go Info
            </button>
          </PlusModalLink>
          <PlusModalLink open to="/examples/modal-routes/info/1" class="text-red-500">
            <button class="daisy-btn daisy-btn-sm daisy-btn-primary">
              Open Info
            </button>
          </PlusModalLink>
        </div>

        <button class="daisy-btn daisy-btn-sm daisy-btn-primary" @click="$modalRouter.close()">
          Close
        </button>
      </div>
    </TheBoundary>
  </div>
</template>
