<script setup lang="ts">
defineProps<{
  news: typeof exampleNews[0]
}>()
</script>

<template>
  <NuxtLink class="px-4 py-5 flex flex-col gap-1" exact-active-class="bg-gray-500/10">
    <div class="font-semibold">
      {{ news.title }}
    </div>
    <div class="text-sm opacity-60">
      {{ news.ago }} by {{ news.author }}
    </div>
  </NuxtLink>
</template>
