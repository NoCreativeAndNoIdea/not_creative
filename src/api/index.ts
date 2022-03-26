import initInstance from '~/common/Request'

export const http = initInstance({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
})
