import { type RouteRecord, type Router, createMemoryHistory, createRouter, useRouter } from 'vue-router'
import { defu } from 'defu'
import type { NamedPageOptions } from '../types'
import { NamedRouteNotFoundSymbol } from './symbols'

export interface NamedRouter extends Router {
  name?: string
  hasPath: (path: string) => boolean
  tryPush: (path: string, notFoundPath?: string) => ReturnType<Router['push']> | undefined
  setSync: (sync: boolean) => void
  sync: (notFoundPath?: string) => ReturnType<Router['push']> | undefined
}

export async function createNamedRouter(name: string, routes: RouteRecord[], router: Router, namedPageOptions: Partial<NamedPageOptions>): Promise<NamedRouter> {
  const options = defu(namedPageOptions, {
    sync: true,
    defaultPath: '/',
    notFoundPath: false,
  } satisfies NamedPageOptions)

  const namedRouter = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  // add a not-found route to detect not found routes
  // to prevent "No match found for location with path" console warning from vue-router
  namedRouter.addRoute({ path: '/:all(.*)*', name: NamedRouteNotFoundSymbol, component: {} })

  function hasPath(path: string) {
    return namedRouter.resolve(path)?.name !== NamedRouteNotFoundSymbol
  }

  // update the sidebar router when the route is matched
  function tryPush(path: string, fallback?: string) {
    if (hasPath(path))
      return namedRouter.push(path)
    else if (fallback)
      return tryPush(fallback)
  }

  function setSync(sync: boolean) {
    options.sync = sync
  }

  const optionsNotFoundPath = () => {
    if (options.notFoundPath)
      return options.notFoundPath === true ? '/404' : options.notFoundPath
    else
      return undefined
  }

  function sync(notFoundPath?: string) {
    return tryPush(router.currentRoute.value.path, notFoundPath ?? optionsNotFoundPath())
  }

  // wait for loading the initial path
  if (options.sync)
    await sync(options.defaultPath)
  else
    await tryPush(options.defaultPath)

  // sync named routers with the global router
  router.afterEach((to) => {
    if (options.sync === true)
      tryPush(to.path, optionsNotFoundPath())
  })

  return {
    ...namedRouter,
    name,
    hasPath,
    tryPush,
    sync,
    setSync,
  }
}
