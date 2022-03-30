export const inBrowser = typeof window !== 'undefined'

export const supportsPassive = true

export const raf = (fn: FrameRequestCallback): number => {
  return inBrowser ? window.requestAnimationFrame(fn) : -1
}

export const cancelRaf = (id: number) => {
  if (inBrowser) {
    cancelAnimationFrame(id)
  }
}

export const doubleRaf = (fn: FrameRequestCallback): void => {
  raf(() => raf(fn))
}
