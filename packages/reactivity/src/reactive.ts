import { isObject } from '@vue3/shared';
import { readonlyHandler, mutableHandler, shallowReactiveHandle, shallowReadonlyHandle } from './baseHandlers';
type target = object

export function readonly(t: target) {
    return creatReactiveObject(t,true,readonlyHandler)
}

export function reactive(t: target) {
    return creatReactiveObject(t,false,mutableHandler)
}

export function shallowReactive(t: target) {
    return creatReactiveObject(t,false,shallowReactiveHandle)
}

export function shallowReadonly(t: target) {
    return creatReactiveObject(t,true,shallowReadonlyHandle)
}

const reactiveMap = new WeakMap()

const readonlyMap = new WeakMap()

export function creatReactiveObject(t: target, isReadOnly: boolean, baseHandler: ProxyHandler<any>) {
    if (!isObject(t)) {
        return t
    }

    const proxyMap = isReadOnly ? readonlyMap : reactiveMap

    const existProxy = proxyMap.get(t)

    //返回缓存
    if (existProxy) {
        return existProxy
    } 

    const p = new Proxy (t,baseHandler)

    isReadOnly&&readonlyMap.set(t,p)

    !isReadOnly&&reactiveMap.set(t,p)

    return p

}