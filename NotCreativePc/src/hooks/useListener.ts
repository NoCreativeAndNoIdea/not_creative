import { effect, watchEffect } from 'vue'

// 常用listener 不更新依赖
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

// watch effect 更新依赖
export const useWatchListener = <T extends keyof WindowEventMap>(
  type: T,
  listener: Listener<T>
) => {
  return watchEffect(() => {
    window.addEventListener(type, listener)
    return () => {
      window.removeEventListener(type, listener)
    }
  })
}
