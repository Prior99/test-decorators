import "reflect-metadata"
import { TestOptionsInput, parseTestOptions, isTestOptionsInput } from "./options"
import { configuration } from "./configure"

export type BeforeEachFunction = (instance: any) => void

export function getBeforeEachs(target: Object): BeforeEachFunction[] {
    const beforeEachs = Reflect.getMetadata("test-decorators:beforeEachs", target)
    if (typeof beforeEachs !== "undefined") { return beforeEachs }
    const newBeforeEachContainer: BeforeEachFunction[] = []
    Reflect.defineMetadata("test-decorators:beforeEachs", newBeforeEachContainer, target)
    return newBeforeEachContainer
}

export type BeforeEachDecorator =
    (target: Object, property: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor

export function beforeEach<Params>(
    target: Object,
    property: string | symbol,
    descriptor: PropertyDescriptor,
): PropertyDescriptor
/**
 * Decorate a method with `@beforeEach` to have it run before each it-call in the suite.
 *
 * @return The decorated method.
 */
export function beforeEach<Params>(
    arg1: Object,
    arg2?: string | symbol,
    arg3?: PropertyDescriptor,
) {
    // Load the `beforeEach` function from the configuration which is stored singleton.
    // It might have been configured to overwrite the mocha ones.
    const { beforeEach: beforeEachFn } = configuration
    if (typeof beforeEachFn !== "function") {
        throw new Error("'beforeEach' not found. Did you call 'configure'?")
    }
    const decorator: BeforeEachDecorator = (target, property, descriptor) => {
        const beforeEachs = getBeforeEachs(target.constructor)
        beforeEachs.push(instance => {
            // This prevents the super-class from executing the beforeEach-functions of the extending classes.
            if (!(instance instanceof target.constructor)) { return }
            beforeEachFn(async (...args: any[]) => await descriptor.value.apply(instance, args))
        })
        return descriptor
    }
    // Function was used as a decorator without a configuration (`@beforeEach`).
    return decorator(arg1, arg2, arg3)
}
