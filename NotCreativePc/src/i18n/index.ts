import { createI18n } from 'vue-i18n'
import { I18nMessages } from '~/utils/types'
import { Language } from '~/store/lang'

const messages: I18nMessages = {}
const langFile = import.meta.globEager('./lang/*.ts')
Object.keys(langFile).forEach((key) => {
  const newKey = key.split('/')[2].split('.')[0]
  messages[newKey] = langFile[key].default
})

export const LANG_ENUM: {
  [key: string]: Language
} = {
  zh: 'zh_CN',
  hk: 'zh_HK',
  en: 'en_US',
}

const i18n = createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE ?? 'zh',
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE ?? 'en',
  messages: { ...messages },
})

export default i18n
