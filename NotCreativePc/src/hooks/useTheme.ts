import { MaybeRef } from '~/utils/types'
import { isRef, effect } from 'vue'
import Storage from '~/common/Storage'
import { isType } from '../utils/checkType'

export type ThemeType = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'THEME_STORAGE_KEY'

let lightMedia: MediaQueryList
let darkMedia: MediaQueryList

const update = (theme: string) => {
  document.querySelector('html')?.setAttribute('data-theme', theme)
  Storage.setItem<string>(THEME_STORAGE_KEY, theme, {
    type: 'session',
  })
}

export default (
  theme?: MaybeRef<ThemeType>
): {
  update: typeof update
} => {
  const localTheme = Storage.getItem<string>(THEME_STORAGE_KEY, 'session')

  if (theme) {
    const currentTheme = isRef(theme) ? theme.value : theme
    update(currentTheme)
  } else if (localTheme) {
    update(localTheme)
  } else {
    update('light')
  }

  const themeListener = (
    callback: (event: MediaQueryListEvent) => void
  ): {
    destroy: () => void
  } => {
    lightMedia = window.matchMedia('(prefers-color-scheme: light)')
    darkMedia = window.matchMedia('(prefers-color-scheme: dark)')
    if (
      isType(darkMedia.addEventListener, 'Function') ||
      isType(lightMedia.addEventListener, 'Function')
    ) {
      lightMedia.addEventListener('change', callback)
      darkMedia.addEventListener('change', callback)
    }

    const destroy = () => {
      lightMedia.removeEventListener('change', callback)
      darkMedia.removeEventListener('change', callback)
    }

    return {
      destroy,
    }
  }

  const themeListenerCallback = (event: MediaQueryListEvent): void => {
    const { media, matches } = event
    update(media.indexOf('dark') && matches ? 'dark' : 'light')
  }

  effect(() => {
    if (!lightMedia && !darkMedia) {
      const { destroy } = themeListener(themeListenerCallback)
      return () => {
        destroy()
      }
    }
  })

  return {
    update,
  }
}
