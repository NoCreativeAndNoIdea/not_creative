import { defineStore } from 'pinia'

export interface AuthStore {
  isLogin: boolean
  token?: string
  tokenHead?: string
}

export interface LoginData {
  username: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStore => ({
    isLogin: false,
    token: '',
    tokenHead: '',
  }),
  getters: {
    getIsLogin(state) {
      return state.isLogin
    },
    getToken(state) {
      return `${state.tokenHead} ${state.token}`
    },
  },
  actions: {
    async login(payload: LoginData) {
      this.isLogin = true
      // TODO: login logic
    },
    async logout() {
      this.isLogin = false
      // TODO: logout logic
    },
  },
})

export default useAuthStore
