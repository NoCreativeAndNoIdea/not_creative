export const isDate = (val: unknown): val is Date => {
  return val instanceof Date && !Number.isNaN(val.getTime())
}

export type DataType =
  | 'Number'
  | 'String'
  | 'Object'
  | 'Boolean'
  | 'Function'
  | 'Null'
  | 'Undefined'
  | 'BigInt'
  | 'Symbol'
  | 'Date'
/**
 * 判断类型是否正确
 * @param val 数据 any
 * @param type 类型 in DataType
 * @returns boolean
 */
export const isType = <T extends DataType>(val: unknown, type: T): val is T => {
  const inlineType = Object.prototype.toString
    .call(val)
    .split(' ')[1]
    .split(']')[0]
    .trim()
  return inlineType === type
}
