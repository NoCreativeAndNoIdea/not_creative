import type { Ref, VNode } from 'vue'

export type Fn = () => void

export type MaybeRef<T> = T | Ref<T>

export type NoValue<T> = null | undefined | T

export interface ObjectKey<T> {
  [key: string]: T
}

export type I18nMessages = ObjectKey<ObjectKey<string>>

export type Key = number | string

declare type VNodeChildAtom =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | void
export type VueNode = VNodeChildAtom | VNodeChildAtom[] | JSX.Element
