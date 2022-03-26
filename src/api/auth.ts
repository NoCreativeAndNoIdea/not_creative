import { http } from '~/api/index'

export interface LoginData {
  username: string
  password: string
  code: string
}

export function login(data: LoginData) {
  return http.post('/login', data)
}
