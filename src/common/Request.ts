import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Storage from '~/common/Storage'

export type OnFulfilled<T> = (value: T) => T | Promise<T>
export type OnRejected<T> = (error: T) => T

export class Request {
  private http: AxiosInstance

  private requestCallbacks: Array<OnFulfilled<AxiosRequestConfig>>
  private responseCallbacks: Array<OnFulfilled<AxiosResponse>>

  constructor(options: AxiosRequestConfig) {
    const defaultOptions: AxiosRequestConfig = {
      baseURL: '/api',
      timeout: 3000,
    }

    this.http = axios.create(Object.assign(defaultOptions, options))

    this.requestCallbacks = []
    this.responseCallbacks = []
    this.requestInterceptors()
    this.responseInterceptors()
  }

  requestInterceptors() {
    this.http.interceptors.request.use(
      (config) => {
        const token = Storage.getItem<string>('v_token')
        if (token && config.headers) {
          config.headers.Authorization = token
        }
        this.requestCallbacks.forEach((fn) => {
          config = fn(config) as AxiosRequestConfig
        })
        return config
      },
      (err) => {
        return Promise.reject(err)
      }
    )
  }

  setRequestInterceptors(onFulfilled: OnFulfilled<AxiosRequestConfig>): void {
    this.requestCallbacks.push(onFulfilled)
  }

  responseInterceptors() {
    this.http.interceptors.response.use(
      (res) => {
        this.responseCallbacks.forEach((fn) => {
          res = fn(res) as AxiosResponse
        })
        return res
      },
      (err) => {
        return Promise.reject(err)
      }
    )
  }

  setResponseInterceptors(onFulfilled: OnFulfilled<AxiosResponse>): void {
    this.responseCallbacks.push(onFulfilled)
  }

  get(url: string) {
    return this.http.get(url)
  }

  post<T>(url: string, data: T) {
    return this.http.post(url, data)
  }

  update<T>(url: string, data: T) {
    return this.http.put(url, data)
  }

  delete(url: string) {
    return this.http.delete(url)
  }

  static init(options: AxiosRequestConfig) {
    return axios.create(options)
  }

  static request(options: AxiosRequestConfig) {
    return axios(options)
  }
}

const initInstance = (): ((options: AxiosRequestConfig) => Request) => {
  let http: Request
  return (options): Request => {
    if (!http) {
      http = new Request(options)
    }
    return http
  }
}

export default initInstance()
