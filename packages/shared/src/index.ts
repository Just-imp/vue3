export const isObject = (t: any): boolean => typeof t === 'object' && t !== null

export const isString = (t: any): t is string => typeof t === 'string'

export const isArray = (t: any): t is Array<any> => Array.isArray(t)

export const isFunction = (t: any): t is Function => typeof t === 'function'

export const isIntegerKey = (t: any) => parseInt(t) + '' === t

export const hasOwn = (t: object, key: any) => Object.prototype.hasOwnProperty.call(t, key)

export const hasChange = (newVal:any,oldVal:any) => newVal !== oldVal
