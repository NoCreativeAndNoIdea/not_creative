import type { ComponentPublicInstance, ExtractPropTypes } from 'vue'
import { makeNumericProp, truthProp } from '~/utils/props'
export interface ListExpose {
  check: () => void
}

export const listProps = {
  error: Boolean,
  offset: makeNumericProp(300),
  loading: Boolean,
  finished: Boolean,
  errorText: String,
  loadingText: String,
  finishedText: String,
  immediateCheck: truthProp,
}

export type ListProps = ExtractPropTypes<typeof listProps>

export type ListInstance = ComponentPublicInstance<ListProps, ListExpose>
