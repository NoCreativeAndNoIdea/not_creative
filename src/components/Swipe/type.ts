import type {
  ComponentPublicInstance,
  ComputedRef,
  ExtractPropTypes,
} from 'vue'
import { makeNumericProp, numericProp, truthProp } from '~/utils/props'

export const swipeProps = {
  vertical: Boolean,
  duration: makeNumericProp(300),
  width: numericProp,
  height: numericProp,
  loop: truthProp,
  autoplay: makeNumericProp(0),
  initialSwipe: makeNumericProp(0),
  touchable: truthProp,
  stopPropagation: truthProp,
}

export type SwipeProps = ExtractPropTypes<typeof swipeProps>

export interface StateRect {
  width?: number
  height?: number
}

export interface SwipeState {
  rect: null | StateRect
  width: number
  height: number
  offset: number
  active: number
  swiping: boolean
}

export interface MoveOptions {
  pace?: number
  offset?: number
  emitChange?: boolean
}

export type SwipeToOptions = {
  immediate?: boolean
}

export type SwipeExpose = {
  prev: () => void
  next: () => void
  resize: () => void
  swipeTo: (index: number, options?: SwipeToOptions) => void
  state: SwipeState
}

export type SwipeProvide = {
  props: SwipeProps
  size: ComputedRef<number>
  count: ComputedRef<number>
  activeIndicator: ComputedRef<number>
}

export type SwipeInstance = ComponentPublicInstance<SwipeProps, SwipeExpose>
