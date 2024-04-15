<template>
  <TheBoundary label="Layout: default" color="gray" class="h-screen flex p-6">
    <div class="flex-1 grid grid-cols-[400px_1fr_400px] gap-6">
      <div>
        <TheNav />
        <PlusParallelPage name="left">
          <template #index>
            <TheBoundary class="p-4" label="layouts/default.vue > PlusParallelPage">
              #index slot, this view is the #index slot of the left parallel page
            </TheBoundary>
          </template>
        </PlusParallelPage>
      </div>
      <slot />
      <PlusParallelPage name="right" />
    </div>
  </TheBoundary>
</template>
