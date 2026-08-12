<script setup lang="ts">
const id = computed(() => Number.parseInt(useRoute().params.id as string))
const news = computed(() => exampleNews[id.value])
</script>

<template>
  <TheBoundary label="$__PAGES_PATH__" class="p-6">
    <h1 class="text-2xl font-bold my-2">
      {{ news.title }}
    </h1>
    <div class="flex text-sm font-semibold opacity-50">
      Author: {{ news.author }} · {{ news.ago }} · News ID: {{ id }}
    </div>
    <div class="my-4">
      {{ news.content }}
    </div>
  </TheBoundary>
</template>
