import { effect, isRef } from 'vue'
import type { MaybeRef, NoValue } from '~/utils/types'

export const useTitle = (
  title: MaybeRef<NoValue<string>> = import.meta.env.VITE_APP_TITLE
) => {
  title = isRef(title) ? title.value : title
  effect(() => {
    if (typeof title === 'string') document.title = title
  })
}
