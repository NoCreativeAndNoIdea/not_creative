import type { CSSProperties } from 'vue'
import { isDef, isType } from './checkType'

export function addUnit(value?: string | number): string | undefined {
  if (isDef(value)) {
    return isType(value, 'Number') ? `${value}px` : String(value)
  }
  return undefined
}

export function getStyleSize(
  originSize?: string | number
): CSSProperties | undefined {
  if (isDef(originSize)) {
    const size = addUnit(originSize)
    return {
      width: size,
      height: size,
    }
  }
}
