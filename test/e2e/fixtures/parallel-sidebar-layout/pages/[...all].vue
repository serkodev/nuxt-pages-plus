<script setup lang="ts">
const route = useRoute()
const routers = resolveParallelRoutersByPath(route.path)

if (!routers.some(r => r.name === 'left'))
  showError(`Path not found: ${route.path}`)
</script>

<template>
  <div>
    <h1>catch-all page</h1>

    <ul id="resolving-routers">
      <li v-for="router in routers" :key="router.name">
        {{ router.name }}
      </li>
    </ul>

    <NuxtLink to="/blackhole">
      Go to an unresolvable page
    </NuxtLink>
  </div>
</template>
