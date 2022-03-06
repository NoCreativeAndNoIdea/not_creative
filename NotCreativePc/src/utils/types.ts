import type { Ref } from 'vue'

export type Fn = () => void

export type MaybeRef<T> = T | Ref<T>

export type NoValue<T> = null | undefined | T

export type ObjectKey<T> = {
  [key: string]: T
}

export type I18nMessages = ObjectKey<ObjectKey<string>>
