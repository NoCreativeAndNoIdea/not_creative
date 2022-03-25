import type { ExtractPropTypes } from 'vue'
import { makeStringProp, numericProp } from '~/utils/props'

export type LoadingType = 'circle' | 'spinner'

export const loadingProps = {
  color: String,
  vertical: Boolean,
  type: makeStringProp<LoadingType>('circle'),
  size: numericProp,
  textSize: numericProp,
  textColor: String,
}

export type LoadingProps = ExtractPropTypes<typeof loadingProps>
