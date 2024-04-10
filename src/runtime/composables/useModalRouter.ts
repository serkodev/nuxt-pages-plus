import { useNuxtApp } from '#app'

export function useModalRouter() {
  return useNuxtApp().$modalRouter
}
