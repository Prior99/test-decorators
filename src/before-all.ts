import "reflect-metadata"
import { TestOptionsInput, parseTestOptions, isTestOptionsInput } from "./options"
import { configuration } from "./configure"

export type BeforeAllFunction = (instance: any) => void

export function getBeforeAlls(target: Object): BeforeAllFunction[] {
    const beforeAlls = Reflect.getMetadata("test-decorators:beforeAlls", target)
    if (typeof beforeAlls !== "undefined") { return beforeAlls }
    const newBeforeAllContainer: BeforeAllFunction[] = []
    Reflect.defineMetadata("test-decorators:beforeAlls", newBeforeAllContainer, target)
    return newBeforeAllContainer
}

export type BeforeAllDecorator =
    (target: Object, property: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor

export function beforeAll<Params>(
    target: Object,
    property: string | symbol,
    descriptor: PropertyDescriptor,
): PropertyDescriptor
/**
 * Decorate a method with `@beforeAll` to have it run before any it-calls in the suite are executed.
 *
 * @return The decorated method.
 */
export function beforeAll<Params>(
    arg1: Object,
    arg2?: string | symbol,
    arg3?: PropertyDescriptor,
) {
    // Load the `beforeAll` function from the configuration which is stored singleton.
    // It might have been configured to overwrite the mocha ones.
    const { beforeAll: beforeAllFn } = configuration
    if (typeof beforeAllFn !== "function") {
        throw new Error("'beforeAll' not found. Did you call 'configure'?")
    }
    const decorator: BeforeAllDecorator = (target, property, descriptor) => {
        const beforeAlls = getBeforeAlls(target.constructor)
        beforeAlls.push(instance => {
            // This prevents the super-class from executing the beforeAll-functions of the extending classes.
            if (!(instance instanceof target.constructor)) { return }
            beforeAllFn(async (...args: any[]) => await descriptor.value.apply(instance, args))
        })
        return descriptor
    }
    // Function was used as a decorator without a configuration (`@beforeAll`).
    return decorator(arg1, arg2, arg3)
}
