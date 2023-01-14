import { track } from "./effect"
import { TrackOpTypes } from "./operators"

interface unwarpRef<T> {
    value:T
}
export function ref<T> (value:T) :unwarpRef<T>{
    return createRef(value)
}

export function createRef<T>(value:T,shallow=false):unwarpRef<T>{
    return new RefImpl(value,shallow)
}

class RefImpl<T> implements unwarpRef<T>{
    public _value
    public readonly __v_isRef = true
    
    constructor(public rawValue:T,public shallow:boolean){

    }

    //类的属性访问器
    get value():T{
        track(this,TrackOpTypes.GET,'value')
        return this.rawValue
    }


}