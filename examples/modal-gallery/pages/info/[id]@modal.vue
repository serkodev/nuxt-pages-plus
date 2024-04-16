<script setup lang="ts">
const parentRoute = useParentRoute()

const id = computed(() => Number.parseInt(parentRoute.params.id as string) || 1)

// const id = ref(Number.parseInt(useParentRoute().params.id as string) || 1)
</script>

<template>
  <Teleport to="body">
    <div class="modal-wrapper">
      <TheBoundary label="$__PAGES_PATH__" class="w-full h-full flex flex-col gap-4 items-center justify-center">
        <div class="flex items-center gap-4">
          <PlusModalLink :to="id > 1 ? `/info/${id - 1}` : undefined">
            <UButton>
              -
            </UButton>
          </PlusModalLink>

          <code>info/{{ id }}</code>

          <PlusModalLink :to="`/info/${id + 1}`">
            <UButton>
              +
            </UButton>
          </PlusModalLink>
        </div>

        <UButton @click="$modalRouter.close()">
          Close
        </UButton>

        <UButton v-if="(($modalRouter.stacks.value ?? []).length ?? 0) > 1" @click="$modalRouter.close(true)">
          Close All
        </UButton>
      </TheBoundary>
    </div>
  </Teleport>
</template>
