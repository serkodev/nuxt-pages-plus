import type { ModuleOptions } from 'nuxt-pages-plus'
/**
 * Type-surface probe: exercises every public composable and type of
 * nuxt-pages-plus so `vue-tsc --noEmit` fails if the shipped d.ts break
 * against the installed nuxt / vue-router version.
 */
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

function expectType<T>(value: T): T {
  return value
}

export function useTypeSurface() {
  // module options type from the package entry (types.d.mts)
  const options: ModuleOptions = {
    separator: '@',
    namedViewsAsParallelRoutes: true,
    parallelPages: {
      side: {
        mode: 'sync',
        sync: 'pre',
        index: '/~index',
        fallback: { redirect: '/' },
      },
    },
    experimental: {
      parallelPageMetaKey: true,
    },
  }

  // composables (auto-imported)
  const routers = useParallelRouters()
  const routes = useParallelRoutes()
  const side = useParallelRouter('side')
  const sideRoute = useParallelRoute('side')
  const parentRouter = useParentRouter()
  const parentRoute = useParentRoute()
  const parentName = useParentRouterName()
  const modal = useModalRouter()
  const resolved = resolveParallelRoutersByPath('/topic/1')

  // parallel router surface
  if (side) {
    expectType<string | undefined>(side.name)
    expectType<boolean>(side.fallback.notFound)
    expectType<boolean>(side.fallback.index)
    expectType<boolean>(side.hasPath('/topic/1'))
    expectType<ReturnType<Router['push']> | undefined>(side.tryPush('/topic/1'))
    expectType<ReturnType<Router['push']> | undefined>(side.sync())
    side.setSync(true)
    // still a full vue-router Router
    expectType<Router['currentRoute']>(side.currentRoute)
  }

  // modal router surface
  expectType<number[] | undefined>(modal.stacks.value)
  modal.close(true)
  expectType<ReturnType<Router['push']>>(modal.push('/info', true))
  expectType<ReturnType<Router['replace']>>(modal.replace('/info'))
  expectType<ReturnType<Router['resolve']> | undefined>(modal.route.value)

  return {
    options,
    routers,
    routes,
    sideRoute: expectType<RouteLocationNormalizedLoaded | undefined>(sideRoute),
    parentRouter: expectType<Router>(parentRouter),
    parentRoute,
    parentName,
    resolved,
  }
}
