import type { ExtractPropTypes } from 'vue'
import { makeNumericProp } from '~/utils/props'

export const DEFAULT_HEAD_HEIGHT = 50

export const TEXT_STATUS = ['pulling', 'loosing', 'success']

export type PullRefreshStatus =
  | 'normal'
  | 'loading'
  | 'loosing'
  | 'pulling'
  | 'success'

/* export interface PullRefreshProps {
  disabled?: boolean
  modelValue?: boolean
  headHeight?: number | string
  successText?: string
  pullingText?: string
  loosingText?: string
  loadingText?: string
  pullDistance?: number | string
  successDuration?: number
  animationDuration?: number
} */

export const pullRefreshProps = {
  disabled: Boolean,
  modelValue: Boolean,
  headHeight: makeNumericProp(DEFAULT_HEAD_HEIGHT),
  successText: String,
  pullingText: String,
  loosingText: String,
  loadingText: String,
  pullDistance: makeNumericProp(DEFAULT_HEAD_HEIGHT),
  successDuration: makeNumericProp(500),
  animationDuration: makeNumericProp(300),
}

export type PullRefreshProps = ExtractPropTypes<typeof pullRefreshProps>

export interface PullRefreshState {
  status: PullRefreshStatus
  distance: number
  duration: number
}
