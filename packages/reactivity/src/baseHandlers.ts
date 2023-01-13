//处理各种proxy的handler
import { isObject } from '@vue3/shared';
import { hasChange, hasOwn, isArray, isIntegerKey } from '../../shared/src/index';
import { track, trigger } from './effect';
import { TrackOpTypes, TriggerOpTypes } from './operators';
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
    set: createSetter(false)
}

export const shallowReactiveHandle = {
    get: shallowGet,
    set: createSetter(true)
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
            track(target, TrackOpTypes, props)
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
    return function set(target: object, props: string | symbol, newVal: unknown, receiver: object) {
        console.log('set:', target, props, newVal);
        const oldVal = target[props]

        let hadKey: boolean = isArray(target) && isIntegerKey(props) ? Number(target.length) > Number(props) : hasOwn(target, props)
        
        if (!hadKey) {
            trigger(target, TriggerOpTypes.SET, props, newVal)
        } else if (hasChange(newVal, oldVal)) {
            trigger(target, TriggerOpTypes.ADD, props, newVal, oldVal)
        }

        const res = Reflect.set(target, props, newVal, receiver)

        return res
    }
}