/* eslint-disable no-console */
import { loadRouteLocation } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { defineNuxtPlugin, useRoute, useRouter } from '#app'
import { computed, shallowRef } from '#imports'

interface ModalPushRecord {
  id: string
  backgroundView: string
}

export const DEBUG = import.meta.dev && import.meta.client && import.meta.env.VITE_PAGES_PLUS_DEBUG

export default defineNuxtPlugin(async (nuxt) => {
  const router = useRouter()

  let routesStackSizeMap: Record<ModalPushRecord['id'], number[]> = {}
  const historyState = shallowRef<ModalPushRecord>()

  const currentStack = computed(() => {
    const currentStatueId = historyState.value?.id
    if (!currentStatueId)
      return
    return routesStackSizeMap[currentStatueId]
  })

  // history is client side only, only hook after app mounted to prevent SSR hydration mismatch
  nuxt.hook('app:mounted', () => {
    // load background view if background view not loaded (when navigate from browser)
    router.beforeResolve(async () => {
      if (history.state.backgroundView)
        await loadRouteLocation(router.resolve(history.state.backgroundView))
    })

    router.afterEach(() => {
      historyState.value = history.state
    })
  })

  const backgroundRoute = computed(() => {
    if (historyState.value?.backgroundView) {
      return router.resolve(historyState.value?.backgroundView)
    } else {
      return undefined
    }
  })

  const route = computed(() => backgroundRoute.value || useRoute())

  async function backgroundNavigate(action: 'push' | 'push_new' | 'replace', to: RouteLocationRaw, backgroundView: string) {
    const state = { id: `plus-${Date.now()}`, backgroundView } satisfies ModalPushRecord

    const _to = {
      ...(typeof to === 'string' ? { path: to } : to),
      state,
    }

    if (action === 'replace') {
      routesStackSizeMap[state.id] = currentStack.value ?? [0]
      return router.replace(_to)
    } else if (action === 'push') {
      const stack = [...(currentStack.value ?? [0])]
      stack.push((stack.pop() ?? 0) + 1)
      routesStackSizeMap[state.id] = stack
      return router.push(_to)
    } else if (action === 'push_new') {
      routesStackSizeMap[state.id] = [...(currentStack.value ?? []), 1]
      return router.push(_to)
    }
  }

  function push(to: RouteLocationRaw, newGroup = false) {
    if (!historyState.value?.backgroundView) {
      routesStackSizeMap = {}
      return backgroundNavigate(newGroup ? 'push_new' : 'push', to, router.currentRoute.value.fullPath)
    }
    return backgroundNavigate(newGroup ? 'push_new' : 'push', to, historyState.value.backgroundView)
  }

  function replace(to: RouteLocationRaw) {
    if (!historyState.value?.backgroundView)
      return router.replace(to)

    return backgroundNavigate('replace', to, historyState.value.backgroundView)
  }

  function close(allGroups = false) {
    function getAllStackSize() {
      return (currentStack.value ?? []).reduce((acc, cur) => acc + cur, 0)
    }

    function getCurrentStackSize() {
      return (currentStack.value ?? [0]).slice(-1)[0]
    }

    const size = allGroups ? getAllStackSize() : getCurrentStackSize()

    if (DEBUG)
      console.log('close modal stack size:', size, `(all groups: ${allGroups})`)

    if (size > 0)
      router.go(-size)
    else
      router.back()
  }

  return {
    provide: {
      modalRouter: {
        route,
        backgroundRoute,
        currentStack,
        close,
        push,
        replace,
      },
    },
  }
})
