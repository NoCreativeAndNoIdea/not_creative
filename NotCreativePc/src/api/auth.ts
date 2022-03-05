import { Api } from './index'
export interface LoginData {
  username: string
  password: string
  code: string
}

export function login(this: Api, data: LoginData) {
  return this?.request?.post('/login', data)
}
