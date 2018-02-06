import "reflect-metadata"
import { TestOptionsInput, parseTestOptions, isTestOptionsInput } from "./options"
import { configuration } from "./configure"

export type TestFunction = (instance: any) => void

export function getTests(target: any): TestFunction[] {
    const tests = Reflect.getMetadata(`test-decorator:tests`, target)
    if (typeof tests !== "undefined") { return tests }
    const newTests: TestFunction[] = []
    Reflect.defineMetadata(`test-decorator:tests`, newTests, target)
    return newTests
}

export type TestDecorator =
    (target: Object, property: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor

export function test<Params>(
    target: Object,
    property: string | symbol,
    descriptor: PropertyDescriptor,
): PropertyDescriptor
export function test<Params>(options?: TestOptionsInput<Params>): TestDecorator
/**
 * Decorate a method with `@test` or `@test("name of the test")` or @test({ ... })` to
 * automatically have it run as a test inside an `it` call.
 *
 * @param options Can be provided or left out, so the decorator can be called with `@test()` or
 *                like `@test`. The name of the test or a configuration object. @see TestOptions
 *
 * @return The decorated method.
 */
export function test<Params>(
    arg1: Object | TestOptionsInput<Params>,
    arg2?: string | symbol,
    arg3?: PropertyDescriptor,
) {
    // Load the `it` and `itOnly` functions from the configuration which is stored singleton.
    // It might have been configured to overwrite the mocha ones.
    const { it, itOnly } = configuration
    if (typeof it !== "function") {
        throw new Error("'it' not found. Did you call 'configure'?")
    }
    const options = isTestOptionsInput(arg1) ? parseTestOptions(arg1) : {
        name: () => (arg2 as string),
        params: undefined,
        only: false,
    }
    const { name, params, only } = options
    const decorator: TestDecorator = (target, property, descriptor) => {
        const tests = getTests(target.constructor)
        const itFunction = only ? itOnly : it
        if (only && typeof itOnly !== "function") {
            throw new Error("Call to 'itOnly' occured but it was not configured.")
        }
        // If `params` was not specified, call `it` once with no parameters.
        if (!params) {
            tests.push(instance => {
                // prevents super-class from executing the tests of extending classes
                if (!(instance instanceof target.constructor)) return;
                itFunction(name(), async (...args: any[]) => await descriptor.value.apply(instance, args))
            })
            return descriptor
        }
        // Call `it` once for all parameters configured in `params`.
        tests.push(...params.map(param => {
            return (instance: any) => {
                // prevents super-class from executing the tests of a child class
                // while also preventing the child class from executing parent tests
                if (!(instance.constructor.name === target.constructor.name)) return;
                itFunction(
                    name(param),
                    async (...args: any[]) => await descriptor.value.apply(instance, [param, ...args]),
                )
            }
        }))
        return descriptor
    }
    // Function was used as a decorator with a configuration (`@test(...)`).
    if (isTestOptionsInput(arg1)) {
        return decorator
    }
    // Function was used as a decorator without a configuration (`@test`).
    return decorator(arg1, arg2, arg3)
}
