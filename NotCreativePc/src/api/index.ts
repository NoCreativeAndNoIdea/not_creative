import initInstance, { Request } from '~/common/Request'

export type ApiFn = <R, T>(data: R) => Promise<T> | T

export interface Apis {
  [key: string]: ApiFn
}

let api: Api

function Injection() {
  const modules = import.meta.globEager('./*.ts')
  return function (target: typeof Api) {
    api = new target()
    Object.values(modules).map((module) => {
      Object.keys(module).forEach((key) => {
        api.constructor.prototype[key] = module[key]
      })
    })
  }
}

@Injection()
export class Api {
  public request: Request
  constructor() {
    this.request = initInstance({
      baseURL: 'http://localhost:8080',
    })
  }
}
const initApi = () => {
  return (): typeof api.constructor.prototype => {
    if (!api) {
      api = new Api()
    }
    return api
  }
}

api = initApi()()

export default api
