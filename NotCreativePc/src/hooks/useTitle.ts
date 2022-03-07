import { effect, isRef } from 'vue'
import type { MaybeRef, NoValue } from '~/utils/types'
import { t } from '~/i18n'

const defaultTitle = import.meta.env.VITE_APP_TITLE

export const useTitle = (title?: MaybeRef<NoValue<string>>) => {
  title = isRef(title) ? title.value : title
  effect(() => {
    if (typeof title === 'string')
      document.title = title ? `${t(defaultTitle)}--${title}` : t(defaultTitle)
  })
}
