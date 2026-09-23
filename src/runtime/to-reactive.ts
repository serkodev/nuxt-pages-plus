import type { Ref } from '#imports'
import { reactive } from '#imports'

// Expose the ref's latest value without changing the returned object's identity.
export function toReactive<T extends object>(objectRef: Ref<T>): T {
  const proxy = new Proxy({} as T, {
    get: (_, p, receiver) => Reflect.get(objectRef.value, p, receiver),
    set: (_, p, value) => Reflect.set(objectRef.value, p, value),
    deleteProperty: (_, p) => Reflect.deleteProperty(objectRef.value, p),
    has: (_, p) => Reflect.has(objectRef.value, p),
    ownKeys: () => Object.keys(objectRef.value),
    getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
  })
  return reactive(proxy) as T
}
