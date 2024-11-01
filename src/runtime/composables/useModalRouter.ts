import type { ModalRouter } from '../modal-router'
import { useNuxtApp } from '#app'

export function useModalRouter(): ModalRouter {
  return useNuxtApp().$modalRouter
}
