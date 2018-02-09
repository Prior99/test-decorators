import "reflect-metadata"
import { TestOptionsInput, parseTestOptions, isTestOptionsInput } from "./options"
import { configuration } from "./configure"

export type AfterEachFunction = (instance: any) => void

export function getAfterEachs(target: Object): AfterEachFunction[] {
    const afterEachs = Reflect.getMetadata("test-decorators:afterEachs", target)
    if (typeof afterEachs !== "undefined") { return afterEachs }
    const newAfterEachContainer: AfterEachFunction[] = []
    Reflect.defineMetadata("test-decorators:afterEachs", newAfterEachContainer, target)
    return newAfterEachContainer
}

export type AfterEachDecorator =
    (target: Object, property: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor

export function afterEach<Params>(
    target: Object,
    property: string | symbol,
    descriptor: PropertyDescriptor,
): PropertyDescriptor
/**
 * Decorate a method with `@afterEach` to have it run after each it-call in the suite.
 *
 * @return The decorated method.
 */
export function afterEach<Params>(
    arg1: Object,
    arg2?: string | symbol,
    arg3?: PropertyDescriptor,
) {
    // Load the `afterEach` function from the configuration which is stored singleton.
    // It might have been configured to overwrite the mocha ones.
    const { afterEach: afterEachFn } = configuration
    if (typeof afterEachFn !== "function") {
        throw new Error("'afterEach' not found. Did you call 'configure'?")
    }
    const decorator: AfterEachDecorator = (target, property, descriptor) => {
        const afterEachs = getAfterEachs(target.constructor)
        afterEachs.push(instance => {
            // This prevents the super-class from executing the afterEach-functions of the extending classes.
            if (!(instance instanceof target.constructor)) { return }
            afterEachFn(async (...args: any[]) => await descriptor.value.apply(instance, args))
        })
        return descriptor
    }
    // Function was used as a decorator without a configuration (`@afterEach`).
    return decorator(arg1, arg2, arg3)
}
