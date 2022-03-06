export const isDate = (val: any): boolean => {
  return val instanceof Date && !Number.isNaN(val.getTime())
}
