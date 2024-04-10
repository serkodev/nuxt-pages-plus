/* eslint-disable no-console */
import { loadRouteLocation } from 'vue-router'
import type { HistoryState, RouteLocationRaw } from 'vue-router'
import { defineNuxtPlugin, useRoute, useRouter } from '#app'
import { computed, ref, shallowRef, watch } from '#imports'

interface ModalPushRecord {
  id: string
  backgroundView: string
}

export const DEBUG = import.meta.dev && import.meta.client && import.meta.env.VITE_PAGES_PLUS_DEBUG

export default defineNuxtPlugin(async (nuxt) => {
  const router = useRouter()

  let routesStackSizeMap: Record<ModalPushRecord['id'], number> = {}
  const historyState = shallowRef<ModalPushRecord>()
  const isOpen = computed(() => !!historyState.value?.backgroundView)

  function getCurrentStackSize() {
    const currentStatueId = historyState.value?.id
    if (!currentStatueId)
      return 0

    return routesStackSizeMap[currentStatueId] ?? 0
  }

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

  async function backgroundNavigate(action: 'push' | 'replace', to: RouteLocationRaw, backgroundView: string) {
    const state = { id: `plus-${Date.now()}`, backgroundView } satisfies ModalPushRecord

    const _to = {
      ...(typeof to === 'string' ? { path: to } : to),
      state,
    }

    if (action === 'replace') {
      routesStackSizeMap[state.id] = getCurrentStackSize()
      return router.replace(_to)
    } else {
      routesStackSizeMap[state.id] = getCurrentStackSize() + 1
      return router.push(_to)
    }
  }

  function open(to: RouteLocationRaw) {
    if (getCurrentStackSize() > 0)
      return false

    routesStackSizeMap = {}
    return backgroundNavigate('push', to, router.currentRoute.value.fullPath)
  }

  function push(to: RouteLocationRaw) {
    if (!historyState.value?.backgroundView)
      return router.push(to)

    return backgroundNavigate('push', to, historyState.value.backgroundView)
  }

  function replace(to: RouteLocationRaw) {
    if (!historyState.value?.backgroundView)
      return router.replace(to)

    return backgroundNavigate('replace', to, historyState.value.backgroundView)
  }

  function close() {
    const size = getCurrentStackSize()

    if (DEBUG)
      console.log('close modal stack size:', size)

    if (size > 0)
      router.go(-size)
    else
      router.back()
  }

  return {
    provide: {
      modalRouter: {
        isOpen,
        route,
        backgroundRoute,
        open,
        close,
        push,
        replace,
      },
    },
  }
})
