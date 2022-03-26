import { ObjectKey } from './types'
import { isDate } from './checkType'
const DEFAULT_DATE_FORMAT = 'yyyy年MM月dd日 hh时mm分ss秒'

/**
 * 简单的日期格式转换,如果需要复杂转换自行扩展
 * @param time {string | number}
 * @param format 参照DEFAULT_DATE_FORMAT
 * @returns date {string}
 */
const dateFormat = (
  time: string | number,
  format: string = DEFAULT_DATE_FORMAT
): string | undefined => {
  try {
    const date = new Date(time)
    if (isDate(date)) {
      const dateObj: ObjectKey<string> = {
        'y+': date.getFullYear().toString(),
        'M+': (date.getMonth() + 1).toString(),
        'd+': date.getDate().toString(),
        'h+': date.getHours().toString(),
        'm+': date.getMinutes().toString(),
        's+': date.getSeconds().toString(),
      }
      Object.keys(dateObj).forEach((key) => {
        const regExp = new RegExp(`(${key})`).exec(format)
        if (regExp) {
          format = format.replaceAll(regExp[1], dateObj[key])
        }
      })
      return format
    } else {
      throw new Error('Incorrect time needed to convert')
    }
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error(e)
    }
  }
}

export default dateFormat
