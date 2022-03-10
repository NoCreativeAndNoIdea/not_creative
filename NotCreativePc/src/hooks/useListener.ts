import { effect } from 'vue'

export type Listener<K extends keyof WindowEventMap> = (
  this: Window,
  ev: WindowEventMap[K]
) => any
export default <T extends keyof WindowEventMap>(
  type: T,
  listener: Listener<T>
) => {
  effect(() => {
    window.addEventListener(type, listener)
    return () => {
      window.removeEventListener(type, listener)
    }
  })
}
