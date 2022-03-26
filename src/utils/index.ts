import { unref } from 'vue'
import { MaybeRef } from './types'

export const generateKey = () => Math.random().toString(36).slice(2, 10)

export function isHidden(elementRef: MaybeRef<HTMLElement | undefined>) {
  const el = unref(elementRef)
  if (!el) return false
  const style = window.getComputedStyle(el)
  const hidden = style.display === 'none'

  const parentHidden = el.offsetParent === null && style.position !== 'fixed'

  return hidden || parentHidden
}
