import "reflect-metadata"
import { SuiteOptionsInput, parseSuiteOptions, isSuiteOptionsInput, SuiteOptions } from "./options"
import { configuration } from "./configure"
import { getTests } from "./test"

export type Constructable<T> = {
    new(): T;
}

export function suite(options?: SuiteOptionsInput): ClassDecorator
export function suite<U, T extends Constructable<U>>(Ctor?: T): T
export function suite<U, T extends Constructable<U>>(arg1: T | SuiteOptionsInput) {
    const { describe, describeOnly } = configuration
    if (typeof describe !== "function") {
        throw new Error("'describe' not found. Did you call 'configure'?")
    }
    const decorator: ClassDecorator = Ctor => {
        let options: SuiteOptions
        if (isSuiteOptionsInput(arg1)) {
            options = parseSuiteOptions(arg1)
        } else {
            options = { name: Ctor.name }
        }
        const { name, only } = options
        const describeFunction = only ? describeOnly : describe
        if (only && typeof describeOnly !== "function") {
            throw new Error("Call to 'describeOnly' occured but it was not configured.")
        }
        describeFunction(name, () => {
            const instance = new (Ctor as any)()
            const tests = getTests(instance.constructor)
            tests.forEach(test => test(instance))
        })
    }
    if (isSuiteOptionsInput(arg1)) {
        return decorator
    }
    return decorator(arg1)
}
