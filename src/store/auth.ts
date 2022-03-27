import Storage from '~/common/Storage'
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

export const useAuthStorage = <T extends AuthStore>(data?: T) => {
  const AUTH_STORAGE_KEY = 'AUTH_STORAGE_KEY'

  if (data) {
    // 使用 session 存储在本地
    Storage.setItem<AuthStore>(AUTH_STORAGE_KEY, data, {
      type: 'session',
    })
  }
  return Storage.getItem<AuthStore>(AUTH_STORAGE_KEY, 'session')
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStore => ({
    isLogin: false,
    token: '',
    tokenHead: '',
    ...useAuthStorage(),
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
      const { isLogin, token, tokenHead } = this
      // TODO: login logic
      useAuthStorage({
        isLogin,
        token,
        tokenHead,
      })
    },
    async logout() {
      this.isLogin = false
      // TODO: logout logic
    },
  },
})

export default useAuthStore
