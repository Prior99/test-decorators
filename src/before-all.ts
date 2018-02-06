import "reflect-metadata"
import { TestOptionsInput, parseTestOptions, isTestOptionsInput } from "./options"
import { configuration } from "./configure"

export type BeforeAllFunction = (instance: any) => void

export function getBeforeAlls(target: Object): BeforeAllFunction[] {
    const beforeAlls = Reflect.getMetadata("test-decorator:beforeAll", target)
    if (typeof beforeAlls !== "undefined") { return beforeAlls }
    const newBeforAllContainer: BeforeAllFunction[] = []
    Reflect.defineMetadata("test-decorator:beforeAll", newBeforAllContainer, target)
    return newBeforAllContainer
}

export type TestDecorator =
    (target: Object, property: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor

export function beforeAll<Params>(
    target: Object,
    property: string | symbol,
    descriptor: PropertyDescriptor,
): PropertyDescriptor
/**
 * Decorate a method with `@beforeAll` to have it run before each it-call in the suite
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
    const decorator: TestDecorator = (target, property, descriptor) => {
        const beforeAlls = getBeforeAlls(target.constructor)
        beforeAlls.push(instance => {
            // prevents super-class from executing the beforeAll-functions of extending classes
            if (!(instance instanceof target.constructor)) { return }
            beforeAllFn(async (...args: any[]) => await descriptor.value.apply(instance, args))
        })
        return descriptor
    }
    // Function was used as a decorator without a configuration (`@beforeAll`).
    return decorator(arg1, arg2, arg3)
}
