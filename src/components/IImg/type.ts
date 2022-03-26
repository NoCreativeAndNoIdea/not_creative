import type { ExtractPropTypes } from 'vue'
import { makeBooleanProp } from '~/utils/props'

export const iImgProps = {
  url: String,
  alt: String,
  default: String,
  lazy: makeBooleanProp(true),
  width: String || Number,
  height: String || Number,
}

export type IImgProps = ExtractPropTypes<typeof iImgProps>
