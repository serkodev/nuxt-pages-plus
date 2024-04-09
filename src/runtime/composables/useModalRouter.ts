import { useNuxtApp, useRouter } from '#app'

export function useModalRouter() {
  return useNuxtApp().$modalRouter
}
