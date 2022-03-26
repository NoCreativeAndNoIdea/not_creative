import { defineStore } from 'pinia'
import i18n from '~/i18n'

export type Language = 'zh_CN' | 'zh_HK' | 'en_US'

export interface MainState {
  language: Language
}

export const useLangStore = defineStore('lang', {
  state: (): MainState => ({
    language: 'zh_CN',
  }),
  getters: {
    // get shorthand language, use in router
    // default is zh
    getLang(state) {
      return state.language.split('_')[0] ?? 'zh'
    },
    // get specification language, use in request
    getLanguage(state): Language {
      return state.language
    },
  },
  actions: {
    setLanguage(payload: Language): void {
      this.language = payload
      i18n.global.locale = this.getLang
    },
  },
})

export default useLangStore
