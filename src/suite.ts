import "reflect-metadata"
import { SuiteOptionsInput, parseSuiteOptions, isSuiteOptionsInput } from "./options"
import { configuration } from "./configure"
import { getTests } from "./test"

export function suite(options?: SuiteOptionsInput): ClassDecorator
export function suite<T extends Function>(Ctor?: Function): T
export function suite<T extends Function>(arg1: T | SuiteOptionsInput) {
    const { describe, describeOnly } = configuration
    if (typeof describe !== "function") {
        throw new Error("'describe' not found. Did you call 'configure'?")
    }
    const options = isSuiteOptionsInput(arg1) ? parseSuiteOptions(arg1) : {
        name: arg1,
        only: false,
    }
    const { name, only } = options
    const decorator: ClassDecorator = Ctor => {
        const describeFunction = only ? describeOnly : describe
        if (only && typeof describeOnly !== "function") {
            throw new Error("Call to 'describeOnly' occured but it was not configured.")
        }
        const instance = new (Ctor as any)()
        const tests = getTests(instance.constructor)
        tests.forEach(test => test())
    }
    if (isSuiteOptionsInput(arg1)) {
        return decorator
    }
    return decorator(arg1)
}
