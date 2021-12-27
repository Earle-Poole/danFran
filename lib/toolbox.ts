import classNames from 'classnames'
import { ClassNameByBreakpointsProps } from './lib.types'

/**
 * Exports a boolean value reporting whether it is client side or server side by checking on the window object
 */
const isClient = typeof window === 'object'

/**
 * Exports a boolean value reporting whether the given API is supported or not
 */
const isApiSupported = (api: string): boolean =>
  typeof window !== 'undefined' ? api in window : false

const classNameByBreakpoint = (obj: ClassNameByBreakpointsProps) => {
  const template = {
    sm: '',
    md: '',
    lg: '',
    xl: '',
    manual: '',
  }
  const templatedObj: { [key: string]: string } = { ...template, ...obj }

  const arr = []

  for (const key in templatedObj) {
    const str = templatedObj[key]
    if (str && key !== 'manual') {
      arr.push(
        str
          .split(' ')
          .map((className) => {
            return `${className[0] === '!' ? '!' : ''}${
              key === 'sm' ? '' : `${key}:`
            }${className[0] === '!' ? className.substring(1) : className}`
          })
          .join(' ')
      )
    }
  }

  return classNames(...arr, templatedObj.manual)
}

export { isClient, isApiSupported, classNameByBreakpoint }
