<script setup lang="ts">
const parentRoute = useParentRoute()

const id = computed(() => Number.parseInt(parentRoute.params.id as string) || 1)
</script>

<template>
  <div class="modal-wrapper">
    <TheBoundary label="$__PAGES_PATH__" class="w-full h-full flex flex-col gap-4 items-center justify-center">
      <div class="flex items-center gap-4">
        <PlusModalLink :to="id > 1 ? `/info/${id - 1}` : undefined">
          <UButton size="sm">
            -
          </UButton>
        </PlusModalLink>

        <code>info/{{ id }}</code>

        <PlusModalLink :to="`/info/${id + 1}`">
          <UButton size="sm">
            +
          </UButton>
        </PlusModalLink>
      </div>

      <UButton size="sm" @click="$modalRouter.close()">
        Close
      </UButton>

      <UButton v-if="(($modalRouter.stacks.value ?? []).length ?? 0) > 1" size="sm" @click="$modalRouter.close(true)">
        Close All
      </UButton>
    </TheBoundary>
  </div>
</template>
