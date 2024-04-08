import { type RouteRecord, type Router, createMemoryHistory, createRouter, useRouter } from 'vue-router'
import { defu } from 'defu'
import type { ParallelPageOptions } from './types'
import { ParallelRouteNotFoundSymbol } from './symbols'

export interface ParallelRouter extends Router {
  name?: string
  hasPath: (path: string) => boolean
  tryPush: (path: string, notFoundPath?: ParallelPageOptions['notFoundPath']) => ReturnType<Router['push']> | undefined
  sync: (notFoundPath?: ParallelPageOptions['notFoundPath']) => ReturnType<Router['push']> | undefined
  setSync: (sync: boolean) => void
}

export async function createParallelRouter(name: string, routes: RouteRecord[], router: Router, parallelPageOptions: Partial<ParallelPageOptions>): Promise<ParallelRouter> {
  const options = defu(parallelPageOptions, {
    sync: true,
    defaultPath: '/',
    notFoundPath: '/not-found',
  } satisfies ParallelPageOptions)

  const parallelRouter = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  // add a not-found route to detect not found routes
  // to prevent "No match found for location with path" console warning from vue-router
  parallelRouter.addRoute({ path: '/:all(.*)*', name: ParallelRouteNotFoundSymbol, component: {} })

  function hasPath(path: string) {
    return parallelRouter.resolve(path)?.name !== ParallelRouteNotFoundSymbol
  }

  // try to push the path, if not found, try to push the not found path
  function tryPush(path: string, notFoundPath: ParallelPageOptions['notFoundPath'] = options.notFoundPath) {
    function pushWithFallback(path: string, ...fallbacks: (string | undefined)[]) {
      for (const _path of [path, ...fallbacks])
        if (_path !== undefined && hasPath(_path))
          return parallelRouter.push(_path)
    }
    return pushWithFallback(path, notFoundPath || undefined)
  }

  // sync the parallel router with the global router
  function sync() {
    return tryPush(router.currentRoute.value.path)
  }

  function setSync(sync: boolean) {
    options.sync = sync
  }

  // initialize sync. if unable to resolve the sync path or if sync is disabled, push the default path.
  const shouldInitSync = options.sync === 'init' || options.sync === true
  await ((shouldInitSync && sync()) || tryPush(options.defaultPath))

  // sync parallel routers with the global router
  router.afterEach(() => {
    if (options.sync === true)
      sync()
  })

  return {
    ...parallelRouter,
    name,
    hasPath,
    tryPush,
    sync,
    setSync,
  }
}
