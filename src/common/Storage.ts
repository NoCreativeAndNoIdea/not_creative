export type StorageType = 'local' | 'session'

export interface StorageSetOptions<T> {
  expired?: number
  type?: StorageType
  time?: number
  data?: T
}

export const currentTime = (): number => Date.parse(new Date().toString())

export default class Storage {
  static getItem<T>(key: string, type: StorageType = 'local'): T | undefined {
    const checkTime = (item?: string): T | undefined => {
      if (item) {
        const { expired, time, data } = JSON.parse(item) as StorageSetOptions<T>
        if (expired && time && currentTime() - time < expired) {
          return data
        } else if (!expired) {
          return data
        } else {
          return undefined
        }
      }
    }

    const item = (
      type === 'local' ? localStorage.getItem(key) : sessionStorage.getItem(key)
    ) as string

    return checkTime(item)
  }

  static setItem<T>(
    key: string,
    value: T,
    options: StorageSetOptions<T>
  ): void {
    const defaultOption = {
      expired: undefined,
      type: 'local',
      time: currentTime(),
    }

    options = Object.assign(defaultOption, options)
    const data = JSON.stringify({
      data: value,
      ...options,
    })
    if (options.type === 'local') {
      localStorage.setItem(key, data)
    } else if (options.type === 'session') {
      sessionStorage.setItem(key, data)
    }
  }
}
