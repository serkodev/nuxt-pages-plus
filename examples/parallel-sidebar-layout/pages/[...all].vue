<script setup lang="ts">
const routers = resolveParallelRoutersByPath(useRoute().path)

if (!routers.some(r => r.name === 'left'))
  showError(`Path not found: ${useRoute().path}`)

const resolvableParallelRouters = computed(() => routers.map(r => r.name))
</script>

<template>
  <ExampleView label="$__PAGES_PATH__">
    <div>
      <p>
        This <code>[...default]</code> route will fallback all routes of global router.
      </p>
      <p>
        The current router <code>{{ $route.path }}</code> is resolving by
        <code>
          {{ resolvableParallelRouters.join(', ') }}
        </code>
        parallel routers.
      </p>
      <p class="my-2">
        You can check the current route is resolvable by any parallel routers by <code>resolveParallelRoutersByPath</code> and redirect to error page if you want.
      </p>
      <p>
        <NuxtLink to="/blackhole">
          <UButton>
            Go to an unresolvable page
          </UButton>
        </NuxtLink>
      </p>
    </div>
  </ExampleView>
</template>
