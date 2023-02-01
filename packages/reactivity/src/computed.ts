import { isFunction } from "@vue3/shared";
import { effect, track, trigger } from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./operators";

type computedOptions = {
    get: Function,
    set: Function,
    [prop: string]: any
}

interface computedRef<T> {
    value: T,
    _value: T,
    _dirty: boolean,
    getter: Function,
    setter: Function,
}

export function computed(getterOrOptions: Function | computedOptions) {
    let getter: Function, setter: Function;

    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions as Function

        setter = () => {
            console.warn('computed value must be readonly');
        }
    } else {
        getter = (getterOrOptions as computedOptions).get

        setter = (getterOrOptions as computedOptions).set
    }

    return new ComputedRefImpl(getter, setter)
}

class ComputedRefImpl implements computedRef<unknown> {
    public _value: unknown;

    public _dirty = true

    public effect: Function

    constructor(public getter: Function, public setter: Function) {
        this.effect = effect(getter, {
            lazy: true,
            scheduler: () => {

                if (!this._dirty) {
                    this._dirty = true
                }

                trigger(this, TriggerOpTypes.SET, 'value')
            }
        })
    }

    get value() {
        //进行依赖收集
        if (this._dirty) {
            this._value = this.effect()

            this._dirty = false
        }

        track(this, TrackOpTypes.GET, 'value')

        return this._value;
    }

    set value(newVal) {
        this.setter()
    }
}