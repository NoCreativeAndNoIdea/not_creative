import { defineStore, acceptHMRUpdate } from 'pinia'

export type Language = 'zh_CN' | 'zh_HK' | 'en_US'

export interface MainState {
  language: Language
}

export const useLang = defineStore('lang', {
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
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLang, import.meta.hot))
}
