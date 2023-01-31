import { hasChange, isArray, isObject } from "@vue3/shared"
import { track, trigger } from "./effect"
import { TrackOpTypes, TriggerOpTypes } from "./operators"
import { reactive } from "./reactive"

interface unwarpRef<T> {
    value: T
}

interface unwarpRefObject<T> {
    value: T,
    target: object,
    key: string | symbol
}

export function ref<T>(value: T): unwarpRef<T> {
    return createRef(value)
}

export function createRef<T>(value: T, shallow = false): unwarpRef<T> {
    return new RefImpl(value, shallow)
}

export function toRef(target: object, key: string | symbol) {
    return new refObject(target,key)
}

export function torefs(target:object){
    let res = isArray(target)?new Array((target as Array<any>).length):{}
    
    for (const key in target) {
        res[key] = toRef(target,key)
    }
    
    return res
}

const convert = (val: any) => isObject(val) ? reactive(val) : val

class RefImpl<T> implements unwarpRef<T>{
    public _value: T
    public readonly __v_isRef = true

    constructor(public rawValue: T, public shallow: boolean | undefined) {
        this._value = shallow ? rawValue : convert(rawValue)
    }

    //类的属性访问器
    get value(): T {
        console.log("ref 类型取值", this);
        track(this, TrackOpTypes.GET, 'value')
        return this.rawValue
    }

    set value(newValue: T) {
        if (hasChange(newValue, this.rawValue)) {
            console.log("ref 类型设值");
            this.rawValue = newValue
            this._value = newValue
            trigger(this, TriggerOpTypes.SET, 'value', newValue)
        }
    }

}

class refObject implements unwarpRef<any>{
    public readonly __v_isRef = true

    constructor(public target: unknown, public key: string | symbol) {

    }

    get value() {
        return this.target[this.key]
    }

    set value(newVal) {
        this.target[this.key] = newVal
    }
}

