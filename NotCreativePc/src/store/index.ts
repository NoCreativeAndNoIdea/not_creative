import { defineStore } from 'pinia'

export type Language = 'zh_CN' | 'zh_HK' | 'en_US'

export interface MainState {
  language: Language
}

export const useStore = defineStore('main', {
  state: (): MainState => ({
    language: 'zh_CN',
  }),
  getters: {
    // get shorthand language, use in router
    // default is zh
    getShorthandLanguage(state) {
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
    },
  },
})
