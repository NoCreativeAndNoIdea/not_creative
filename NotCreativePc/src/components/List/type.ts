import { ComponentPublicInstance } from 'vue'
import { ListProps } from './index'
export type ListExpose = {
  check: () => void
}

export type ListInstance = ComponentPublicInstance<ListProps, ListExpose>
