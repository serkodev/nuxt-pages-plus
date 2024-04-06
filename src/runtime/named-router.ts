import { type RouteRecord, type Router, createMemoryHistory, createRouter, useRouter } from 'vue-router'
import { NamedRouteNotFoundSymbol } from './symbols'

export interface NamedRouter extends Router {
  name?: string
  hasPath: (path: string) => boolean
  tryPush: (path: string, fallback?: string) => ReturnType<Router['push']> | undefined
}

export function createNamedRouter(name: string, routes: RouteRecord[]): NamedRouter {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  // add a not-found route to detect not found routes
  // to prevent "No match found for location with path" console warning from vue-router
  router.addRoute({ path: '/:all(.*)*', name: NamedRouteNotFoundSymbol, component: {} })

  function hasPath(path: string) {
    return router.resolve(path)?.name !== NamedRouteNotFoundSymbol
  }

  // update the sidebar router when the route is matched
  function tryPush(path: string, fallback?: string) {
    if (hasPath(path))
      return router.push(path)
    else if (fallback)
      return router.push(fallback)
  }

  return {
    ...router,
    name,
    hasPath,
    tryPush,
  }
}

// unused, just in case
function _globalRouter(): NamedRouter {
  const router = useRouter()

  function hasPath(path: string) {
    return router.resolve(path)?.matched.length > 0
  }

  function tryPush(path: string, fallback?: string) {
    if (hasPath(path))
      return router.push(path)
    else if (fallback)
      return router.push(fallback)
  }

  return { ...router, hasPath, tryPush }
}
