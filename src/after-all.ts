import "reflect-metadata"
import { TestOptionsInput, parseTestOptions, isTestOptionsInput } from "./options"
import { configuration } from "./configure"

export type AfterAllFunction = (instance: any) => void

export function getAfterAlls(target: Object): AfterAllFunction[] {
    const afterAlls = Reflect.getMetadata("test-decorators:afterAlls", target)
    if (typeof afterAlls !== "undefined") { return afterAlls }
    const newAfterAllContainer: AfterAllFunction[] = []
    Reflect.defineMetadata("test-decorators:afterAlls", newAfterAllContainer, target)
    return newAfterAllContainer
}

export type AfterAllDecorator =
    (target: Object, property: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor

export function afterAll<Params>(
    target: Object,
    property: string | symbol,
    descriptor: PropertyDescriptor,
): PropertyDescriptor
/**
 * Decorate a method with `@afterAll` to have it run after any it-calls in the suite are executed.
 *
 * @return The decorated method.
 */
export function afterAll<Params>(
    arg1: Object,
    arg2?: string | symbol,
    arg3?: PropertyDescriptor,
) {
    // Load the `afterAll` function from the configuration which is stored singleton.
    // It might have been configured to overwrite the mocha ones.
    const { afterAll: afterAllFn } = configuration
    if (typeof afterAllFn !== "function") {
        throw new Error("'afterAll' not found. Did you call 'configure'?")
    }
    const decorator: AfterAllDecorator = (target, property, descriptor) => {
        const afterAlls = getAfterAlls(target.constructor)
        afterAlls.push(instance => {
            // This prevents the super-class from executing the afterAll-functions of the extending classes.
            if (!(instance instanceof target.constructor)) { return }
            afterAllFn(async (...args: any[]) => await descriptor.value.apply(instance, args))
        })
        return descriptor
    }
    // Function was used as a decorator without a configuration (`@afterAll`).
    return decorator(arg1, arg2, arg3)
}
