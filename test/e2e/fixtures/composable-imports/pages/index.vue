<script setup lang="ts">
import {
  resolveParallelRoutersByPath,
  useModalRouter,
  useParallelRoute,
  useParallelRouter,
  useParallelRouters,
  useParallelRoutes,
  useParentRoute,
  useParentRouter,
  useParentRouterName,
} from '#imports'

const parentRoute = useParentRoute()
const parentRouter = useParentRouter()
const parentName = useParentRouterName()
const routers = useParallelRouters()
const routes = useParallelRoutes()
const parallelRouter = useParallelRouter('missing')
const parallelRoute = useParallelRoute('missing')
const resolved = resolveParallelRoutersByPath('/')
const modal = useModalRouter()

const ready = parentRoute.path === '/'
  && parentRouter.resolve('/').path === '/'
  && parentName.value === undefined
  && Object.keys(routers).length === 0
  && Object.keys(routes).length === 0
  && parallelRouter === undefined
  && parallelRoute === undefined
  && resolved.length === 0
  && typeof modal.push === 'function'
</script>

<template>
  <div>{{ ready ? 'all composables ready' : 'composable failure' }}</div>
</template>
