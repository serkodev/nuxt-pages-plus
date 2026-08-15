/* eslint-disable no-console */
import type { Router } from 'vue-router'
import type { PageMeta } from '#app'
import type { ComputedRef } from '#imports'
import { loadRouteLocation, useRouter } from 'vue-router'
import { defineNuxtPlugin } from '#app'
import { computed, shallowRef } from '#imports'
import { createModalScrollBehavior } from './modal-scroll'

interface ModalPushRecord {
  id: string
  backgroundView: string
}

export interface ModalRouter {
  /**
   * the route of the background view of the modal
   */
  route: ComputedRef<ReturnType<Router['resolve']> | undefined>

  /**
   * whether a modal route is currently open
   * (the current history entry carries a modal background view)
   */
  isOpen: ComputedRef<boolean>

  /**
   * the background route's layout while a modal is open,
   * or the current route's layout otherwise
   */
  layout: ComputedRef<PageMeta['layout']>

  /**
   * the opened stacks count of the modal view
   */
  stacks: ComputedRef<number[] | undefined>

  /**
   * Close the modal
   * @param allOpened whether to close all opened modals
   */
  close: (allOpened?: boolean) => void

  /**
   * method to push a new route to the modal
   */
  push: (to: Parameters<Router['push']>[0], open?: boolean) => ReturnType<Router['push']>

  /**
   * method to replace the current route of the modal
   */
  replace: (to: Parameters<Router['replace']>[0]) => ReturnType<Router['replace']>

  /**
   * @deprecated use `route` instead
   */
  backgroundRoute: ComputedRef<ReturnType<Router['resolve']> | undefined>
}

const DEBUG = false

export default defineNuxtPlugin(async (nuxt) => {
  const router = useRouter()

  let routesStackSizeMap: Record<ModalPushRecord['id'], number[]> = {}
  const historyState = shallowRef<ModalPushRecord>()

  const stacks = computed(() => {
    const currentStatueId = historyState.value?.id
    if (!currentStatueId)
      return
    return routesStackSizeMap[currentStatueId]
  })

  // history is client side only, only hook after app mounted to prevent SSR hydration mismatch
  nuxt.hook('app:mounted', () => {
    // a refreshed page renders as a plain full page, but the modal state persisted
    // in its history entry would resurrect the modal when the entry is revisited
    // with browser back / forward, so strip it from the current entry only.
    // the keys must be kept as explicit undefined: vue-router re-merges its own
    // (stale) cached state with history.state on the next push, and only keys
    // present in history.state override the cached values
    if (history.state?.backgroundView) {
      history.replaceState({ ...history.state, id: undefined, backgroundView: undefined }, '')
    }

    // Nuxt installs its final scroll behavior during app:created. Wrap it after
    // mounting so modal entries preserve the background instead of running the
    // standalone page's scroll behavior. At scroll time, history.state already
    // belongs to the destination entry, so plain navigations remain unchanged.
    const scrollBehavior = router.options.scrollBehavior
    if (scrollBehavior) {
      router.options.scrollBehavior = createModalScrollBehavior(
        scrollBehavior,
        () => !!history.state?.backgroundView,
      )
    }

    // load background view if background view not loaded (when navigate from browser)
    router.beforeResolve(async () => {
      if (history.state?.backgroundView)
        await loadRouteLocation(router.resolve(history.state.backgroundView))
    })

    router.afterEach((_to, _from, failure) => {
      // an aborted navigation commits nothing, but at this point history.state
      // may still belong to the reverted target entry (a guard-aborted popstate
      // is restored asynchronously with vue-router's listener paused, so no
      // later navigation re-syncs it) — snapshotting it would desync the modal
      // state from the entry the browser actually stays on
      if (!failure)
        historyState.value = history.state
    })
  })

  const route = computed(() => {
    if (historyState.value?.backgroundView) {
      return router.resolve(historyState.value?.backgroundView)
    } else {
      return undefined
    }
  })

  const isOpen = computed(() => !!historyState.value?.backgroundView)

  const layout = computed<PageMeta['layout']>(() => {
    return (route.value ? route.value.meta.layout : router.currentRoute.value.meta.layout)
  })

  async function backgroundNavigate(
    action: 'push' | 'push_open' | 'replace',
    to: Parameters<Router['push']>[0] | Parameters<Router['replace']>[0],
    backgroundView: string,
  ) {
    const state = { id: `plus-${Date.now()}`, backgroundView } satisfies ModalPushRecord

    const _to = {
      ...(typeof to === 'string' ? router.resolve(to) : to),
      state,
    }

    if (action === 'replace') {
      routesStackSizeMap[state.id] = stacks.value ?? [0]
      return router.replace(_to)
    } else if (action === 'push') {
      const newStack = [...(stacks.value ?? [0])]
      newStack.push((newStack.pop() ?? 0) + 1)
      routesStackSizeMap[state.id] = newStack
      return router.push(_to)
    } else if (action === 'push_open') {
      routesStackSizeMap[state.id] = [...(stacks.value ?? []), 1]
      return router.push(_to)
    }
  }

  const push: ModalRouter['push'] = function (to, open = false) {
    if (!historyState.value?.backgroundView) {
      routesStackSizeMap = {}
      return backgroundNavigate(open ? 'push_open' : 'push', to, router.currentRoute.value.fullPath)
    }
    return backgroundNavigate(open ? 'push_open' : 'push', to, historyState.value.backgroundView)
  }

  const replace: ModalRouter['replace'] = function (to) {
    if (!historyState.value?.backgroundView)
      return router.replace(to)

    return backgroundNavigate('replace', to, historyState.value.backgroundView)
  }

  function close(allOpened = false) {
    function getAllStackSize() {
      return (stacks.value ?? []).reduce((acc, cur) => acc + cur, 0)
    }

    function getCurrentStackSize() {
      return (stacks.value ?? [0]).slice(-1)[0] ?? 0
    }

    const size = allOpened ? getAllStackSize() : getCurrentStackSize()

    if (DEBUG)
      console.log('close modal stack size:', size, `(all stacks: ${allOpened})`)

    if (size > 0)
      router.go(-size)
    else
      router.back()
  }

  return {
    provide: {
      modalRouter: {
        route,
        isOpen,
        layout,
        backgroundRoute: route,
        stacks,
        close,
        push,
        replace,
      } satisfies ModalRouter,
    },
  }
})
