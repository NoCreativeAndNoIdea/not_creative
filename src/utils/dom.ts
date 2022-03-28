import { useWindowSize } from '~/hooks'

export type ScrollElement = Element | Window

export function getScrollTop(el: ScrollElement): number {
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset
  return Math.max(top, 0)
}

export const stopPropagation = (event: Event) => event.stopPropagation()

export function preventDefault(
  event: Event,
  isStopPropagation?: boolean
): void {
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault()
  }

  if (isStopPropagation) {
    stopPropagation(event)
  }
}

export const { width: windowWidth, height: windowHeight } = useWindowSize()
