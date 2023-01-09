let uid:number = 0

export function effect (depens:Function,options:{lazy:boolean}):Function {
    const eff = createReactiveEffect(depens,options)

    if(!options.lazy){
        eff()
    }

    return eff
}

function createReactiveEffect (depens:Function,options:{lazy:boolean}):Function{
    const effect = function reactiveEffect (){}

    effect.id = uid++

    effect._isEffect = true

    effect.raw = depens

    effect.options = options
    
    return effect
}