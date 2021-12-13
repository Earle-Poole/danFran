/**
 * Exports a boolean value reporting whether it is client side or server side by checking on the window object
 */
const isClient = typeof window === 'object'

/**
 * Exports a boolean value reporting whether the given API is supported or not
 */
const isApiSupported = (api: string): boolean =>
  typeof window !== 'undefined' ? api in window : false

export { isClient, isApiSupported }
