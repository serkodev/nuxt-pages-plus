<script setup lang="ts">
const items = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: 'Bookmark',
    icon: 'i-lucide-bookmark',
    to: '/bookmark',
  },
  {
    label: 'About',
    icon: 'i-lucide-info',
    to: '/about',
  },
]
</script>

<template>
  <TheBoundary label="$__PAGES_PATH__" color="gray" class="h-screen flex p-6">
    <div class="flex-1 grid grid-cols-[400px_1fr] gap-6">
      <div>
        <UNavigationMenu :items class="px-2" />
        <PlusParallelPage name="left">
          <template #index>
            <TheBoundary class="p-8" label="$__PAGES_PATH__ > PlusParallelPage">
              #index slot, this view is the #index slot of the left parallel page
            </TheBoundary>
          </template>
        </PlusParallelPage>
      </div>
      <PlusParallelPage name="main" />
    </div>
  </TheBoundary>
</template>
