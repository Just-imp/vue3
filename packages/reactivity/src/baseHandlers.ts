//处理各种proxy的handler
import { isObject } from '@vue3/shared';
import { reactive, readonly } from './reactive';
const get = createGetter()

const shallowGet = createGetter(false, true)

const readonlyGet = createGetter(true, false)

const shallowReadonlyGet = createGetter(true, true)

const readonlySet = (target: object, prop: string | symbol, value: unknown): boolean => {
    let s: string = typeof prop === 'string' ? prop : prop.toString()

    console.warn(`can't set value: ${value} for key ${s},because key ${s} is a readOnly type `);

    return false
}


export const readonlyHandler: ProxyHandler<any> = {
    get: readonlyGet,
    set: readonlySet
}

export const mutableHandler = {
    get: get,
    set:createSetter(false)
}

export const shallowReactiveHandle = {
    get: shallowGet,
    set:createSetter(true)
}

export const shallowReadonlyHandle = {
    get: shallowReadonlyGet,
    set: readonlySet
}

function createGetter(isReadOnly = false, shallow = false) {
    return (target: object, props: string | symbol, receiver: object): object => {
        let res = Reflect.get(target, props, receiver)

        if (!isReadOnly) {
            //进行依赖收集
        }

        if (shallow) {
            return res
        }

        if (isObject(res)) {
            return isReadOnly ? readonly(res) : reactive(res)
        }

        return res
    }
}

function createSetter(shallow = false) {
    return (target: object, props: string | symbol, newVal:unknown,receiver: object)=>{
        const res = Reflect.set(target,props,newVal)
        return res
    }
}