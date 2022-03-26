import { unref, watch } from 'vue'
import { MaybeRef } from '../utils/types'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

export function useIntersectionObserver(
  element: MaybeRef<Element | undefined>,
  callback: IntersectionObserverCallback,
  { root = null, rootMargin = '0%', threshold = 0.1 }
) {
  const isSupported = window && 'IntersectionObserver' in window

  let cleanup = noop

  const stopWatch = isSupported
    ? watch(
        () => ({
          el: unref(element),
          root: unref(root),
        }),
        ({ el, root }) => {
          cleanup()
          if (!el) return
          const observer = new window.IntersectionObserver(callback, {
            root,
            rootMargin,
            threshold,
          })

          observer.observe(el)

          cleanup = () => {
            observer.disconnect()
            cleanup = noop
          }
        },
        { immediate: true, flush: 'post' }
      )
    : noop

  const stop = () => {
    cleanup()
    stopWatch()
  }

  return {
    isSupported,
    stop,
    cleanup,
  }
}
