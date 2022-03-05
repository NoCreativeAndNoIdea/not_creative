import type { Ref } from 'vue'

export type Fn = () => void

export type MaybeRef<T> = T | Ref<T>

export type NoValue<T> = null | undefined | T
