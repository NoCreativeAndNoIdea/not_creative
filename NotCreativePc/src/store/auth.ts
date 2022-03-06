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

export const AUTH_STORAGE_KEY = 'AUTH_STORAGE_KEY'

const authStorageData = Storage.getItem<AuthStore>(AUTH_STORAGE_KEY, 'session')

export const useAuthStore = defineStore('auth', {
  state: (): AuthStore =>
    Object.assign(
      {
        isLogin: false,
        token: '',
        tokenHead: '',
      },
      authStorageData
    ),
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

      // 使用 session 存储在本地
      Storage.setItem<AuthStore>(
        AUTH_STORAGE_KEY,
        {
          isLogin,
          token,
          tokenHead,
        },
        {
          type: 'session',
        }
      )
    },
    async logout() {
      this.isLogin = false
      // TODO: logout logic
    },
  },
})

export default useAuthStore
