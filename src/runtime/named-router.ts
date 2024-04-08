import { type RouteRecord, type Router, createMemoryHistory, createRouter, useRouter } from 'vue-router'
import { defu } from 'defu'
import type { NamedPageOptions } from './types'
import { NamedRouteNotFoundSymbol } from './symbols'

export interface NamedRouter extends Router {
  name?: string
  hasPath: (path: string) => boolean
  tryPush: (path: string, notFoundPath?: NamedPageOptions['notFoundPath']) => ReturnType<Router['push']> | undefined
  sync: (notFoundPath?: NamedPageOptions['notFoundPath']) => ReturnType<Router['push']> | undefined
  setSync: (sync: boolean) => void
}

export async function createNamedRouter(name: string, routes: RouteRecord[], router: Router, namedPageOptions: Partial<NamedPageOptions>): Promise<NamedRouter> {
  const options = defu(namedPageOptions, {
    sync: true,
    defaultPath: '/',
    notFoundPath: '/not-found',
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

  // try to push the path, if not found, try to push the not found path
  function tryPush(path: string, notFoundPath: NamedPageOptions['notFoundPath'] = options.notFoundPath) {
    function pushWithFallback(path: string, ...fallbacks: (string | undefined)[]) {
      for (const _path of [path, ...fallbacks])
        if (_path !== undefined && hasPath(_path))
          return namedRouter.push(_path)
    }
    return pushWithFallback(path, notFoundPath || undefined)
  }

  // sync the named router with the global router
  function sync() {
    return tryPush(router.currentRoute.value.path)
  }

  function setSync(sync: boolean) {
    options.sync = sync
  }

  // initialize sync. if unable to resolve the sync path or if sync is disabled, push the default path.
  const shouldInitSync = options.sync === 'init' || options.sync === true
  await ((shouldInitSync && sync()) || tryPush(options.defaultPath))

  // sync named routers with the global router
  router.afterEach(() => {
    if (options.sync === true)
      sync()
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
