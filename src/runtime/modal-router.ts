/* eslint-disable no-console */
import { loadRouteLocation } from 'vue-router'
import type { HistoryState, RouteLocationRaw } from 'vue-router'
import { defineNuxtPlugin, useRoute, useRouter } from '#app'
import { computed, ref, shallowRef, watch } from '#imports'

interface ModalPushRecord {
  id: number
  backgroundView: string
}

export const DEBUG = import.meta.dev && import.meta.client && import.meta.env.VITE_PAGES_PLUS_DEBUG

export default defineNuxtPlugin(async (nuxt) => {
  const router = useRouter()

  const pushStack = ref<ModalPushRecord[]>([])
  const historyState = shallowRef<ModalPushRecord>()
  const isOpen = computed(() => !!historyState.value?.backgroundView)

  function backSize() {
    const currentStatueId = historyState.value?.id
    if (!currentStatueId)
      return 0

    const stateIdIndex = pushStack.value.findIndex(record => record.id === currentStatueId)
    return stateIdIndex + 1
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

  function backgroundNavigate(action: 'push' | 'replace', to: RouteLocationRaw, backgroundView: string) {
    const state = { id: Date.now(), backgroundView } satisfies ModalPushRecord

    const _to = {
      ...(typeof to === 'string' ? { path: to } : to),
      state,
    }

    if (action === 'replace') {
      // find push stack record and replace it
      const currentStateIndex = pushStack.value.findIndex(record => record.id === historyState.value?.id)
      if (currentStateIndex !== -1)
        pushStack.value[currentStateIndex] = state

      return router.replace(_to)
    } else {
      pushStack.value.push(state)

      return router.push(_to)
    }
  }

  function open(to: RouteLocationRaw) {
    if (backSize() > 0)
      return false

    pushStack.value = []
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
    const size = backSize()

    if (DEBUG)
      console.log('close modal back times:', size)

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
