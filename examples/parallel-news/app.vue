<script setup lang="ts">
const links = [
  { name: 'Home', path: '/' },
  { name: 'Hot', path: '/hot' },
]

const router = useParallelRouter('left')
</script>

<template>
  <div class="min-h-screen flex p-6">
    <div class="flex-1 grid grid-cols-[320px_1fr] gap-6">
      <div class="flex flex-col">
        <div class="flex gap-1 rounded-lg bg-elevated p-1 font-semibold self-start">
          <UButton
            v-for="link in links"
            :key="link.name"
            :to="link.path"
            size="sm"
            :color="link.path === router?.currentRoute.value.path ? 'primary' : 'neutral'"
            :variant="link.path === router?.currentRoute.value.path ? 'solid' : 'ghost'"
          >
            {{ link.name }}
          </UButton>
        </div>

        <PlusParallelPage name="left" />
      </div>
      <NuxtPage />
    </div>
  </div>
</template>
