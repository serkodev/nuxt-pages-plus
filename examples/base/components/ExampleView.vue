<script setup lang="ts">
defineProps<{
  label: string
  color?: string
}>()

const routerName = useNamedRouter()?.name ?? 'global'
const path = useParentRoute().path
</script>

<template>
  <TheBoundary :label :color>
    <UContainer>
      <div class="my-4">
        <h1 class="my-6">
          <div class="flex items-center gap-3">
            <div class="opacity-50 border inline px-1.5 py-0.5 rounded-md text-sm">
              {{ routerName }}
            </div>
            <div class="text-xl font-semibold">
              {{ path }}
            </div>
          </div>
        </h1>
        <p>
          This is the <code>{{ path }}</code> page of <code>{{ routerName }}</code> router.
        </p>
      </div>
      <slot />
    </UContainer>
  </TheBoundary>
</template>
