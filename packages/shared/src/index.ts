export const isObject = (t: any): boolean => typeof t === 'object' && t !== null

export const isString = (t: any): t is string => {
    return typeof t === 'string'
}