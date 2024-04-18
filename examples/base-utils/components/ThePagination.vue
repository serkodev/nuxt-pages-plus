<script setup lang="ts">
defineProps<{
  total: number
}>()
const page = defineModel<number>({ default: 1 })
</script>

<template>
  <div class="daisy-join">
    <button class="daisy-join-item daisy-btn daisy-btn-sm" @click="page > 1 && page--">
      ←
    </button>
    <button
      v-for="n in total"
      :key="n"
      class="daisy-join-item daisy-btn daisy-btn-sm"
      :class="page === n && 'text-black bg-nuxt hover:bg-nuxt'"
      @click="page = n"
    >
      {{ n }}
    </button>

    <button class="daisy-join-item daisy-btn daisy-btn-sm" @click="page < 9 && page++">
      →
    </button>
  </div>
</template>
