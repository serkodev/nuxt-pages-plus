import { loadRouteLocation } from 'vue-router'
import type { HistoryState, RouteLocationRaw } from 'vue-router'
import { defineNuxtPlugin, useRoute, useRouter } from '#app'
import { computed, ref } from '#imports'

interface ModalPushRecord {
  id: number
  backgroundView: string | undefined
}

export default defineNuxtPlugin(async (nuxt) => {
  const router = useRouter()

  const pushStack = ref<ModalPushRecord[]>([])
  const historyState = ref<HistoryState>()

  const backgroundView = computed(() => {
    const record = pushStack.value.find(record => record.id === historyState.value?.id)
    return record?.backgroundView
  })

  const isOpen = computed(() => !!backgroundView.value)

  function backSize() {
    const currentStatueId = historyState.value?.id
    if (!currentStatueId)
      return 0

    const stateIdIndex = pushStack.value.findIndex(record => record.id === currentStatueId)
    return stateIdIndex + 1
  }

  // only update history state when the app is mounted, fix SSR issue
  nuxt.hook('app:mounted', () => {
    router.afterEach(() => {
      historyState.value = history.state
    })
  })

  router.beforeResolve(async () => {
    if (backgroundView.value)
      await loadRouteLocation(router.resolve(backgroundView.value))
  })

  const backgroundRoute = computed(() => {
    if (backgroundView.value) {
      return router.resolve(backgroundView.value)
    } else {
      return undefined
    }
  })

  const route = computed(() => backgroundRoute.value || useRoute())

  function pushWithBackground(to: RouteLocationRaw, backgroundView?: string) {
    if (!backgroundView)
      return router.push(to)

    const id = Date.now()
    pushStack.value.push({ backgroundView, id })
    return router.push({
      ...(typeof to === 'string' ? { path: to } : to),
      state: { id, backgroundView },
    })
  }

  function open(to: RouteLocationRaw) {
    if (backSize() > 0) {
      return false
    }
    pushStack.value = []
    return pushWithBackground(to, router.currentRoute.value.fullPath)
  }

  function push(to: RouteLocationRaw) {
    return pushWithBackground(to, backgroundView.value)
  }

  function close() {
    const size = backSize()
    if (size > 0)
      router.go(-size)
  }

  return {
    provide: {
      modalRouter: {
        isOpen,
        route,
        backgroundRoute,
        open,
        push,
        close,
      },
    },
  }
})
