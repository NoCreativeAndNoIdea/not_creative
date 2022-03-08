import { isType } from './checkType'

function classNames(...args: any[]): string {
  const classes = []
  for (let i = 0; i < args.length; i++) {
    const value = args[i]
    if (!value) continue
    if (isType(value, 'String')) {
      classes.push(value)
    } else if (isType(value, 'Array')) {
      for (let i = 0; i < value.length; i++) {
        const inner = classNames(value[i])
        if (inner) {
          classes.push(inner)
        }
      }
    } else if (isType(value, 'Object')) {
      for (const name in value) {
        if (value[name]) {
          classes.push(name)
        }
      }
    }
  }
  return classes.join(' ')
}

export default classNames
