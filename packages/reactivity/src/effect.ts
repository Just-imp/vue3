import { isArray, isIntegerKey } from "../../shared/src/index";
import { TriggerOpTypes } from "./operators";

let uid: number = 0

let activeEffect: Function | undefined;

let effectStack = []

interface effectOptionType {
    lazy: boolean
    [prop: string]: any
    scheduler?: Function
}

type effectType = {
    (...args:any[]);
    options:effectOptionType
    id:Number
    _isEffect:Boolean
    raw:Function
}

export function effect(depens: Function, options: effectOptionType = { lazy: false }): effectType {
    const eff = createReactiveEffect(depens, options)

    if (!options.lazy) {
        eff()
    }

    return eff
}

function createReactiveEffect(depens: Function, options: effectOptionType): effectType {
    const effect = function reactiveEffect() {
        depens()
        if (effectStack.includes(effect)) {
            console.warn('do not update reactive data in effect');
        } else {
            try {
                effectStack.push(effect)

                activeEffect = effect

                return depens()

            } finally {
                effectStack.pop();

                activeEffect = effectStack[effectStack.length - 1]
            }

        }
    }

    effect.id = uid++

    effect._isEffect = true

    effect.raw = depens

    effect.options = options

    return effect
}

const targetMap: WeakMap<any, any> = new WeakMap()

export function track(target: object, type: number, key: string | symbol) {
    if (activeEffect === undefined) {
        return
    }

    let depsMap = targetMap.get(target)

    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }

    let dep: Set<any> = depsMap.get(key)

    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }

    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
    }

    return

}

export function trigger(target: object, type: 0 | 1, key?: symbol | string, newVal?: any, oldVal?: any) {

    const depsMap = targetMap.get(target)

    if (!depsMap) return

    const effects = new Set()

    const add = (effectsToAdd: Set<Function>) => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => {
                effects.add(effect)
            })
        }
    }

    //数组长度变化特殊处理
    if (key === 'length' && isArray(target)) {

        depsMap.forEach((deps: Set<Function>, key: string | symbol) => {

            try {
                if (typeof key !== 'symbol' && (key === 'length' || (Number(key) + 1) > newVal)) {
                    //数组长度变小,被删除的项的Effect也需要执行
                    add(deps)
                }
            } catch (e) {
                console.log('err an key is:', key);
            }

        })

    } else {

        if (key !== undefined) {
            //常规情况
            console.log(key);
            add(depsMap.get(key))
        }

        switch (type) {
            case TriggerOpTypes.ADD:
                if (isArray(target) && isIntegerKey(key)) {
                    add(depsMap.get('length'))
                }
                break
            default:
                break
        }

    }

    effects.forEach((e: effectType) => {
        //如果存在scheduler时就执行scheduler函数
        e.options.scheduler && typeof e.options.scheduler === 'function' ? e.options.scheduler() : e()
    })

}
