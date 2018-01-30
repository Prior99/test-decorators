export interface TestOptions<Params> {
    /**
     * The name of the test or a function being handed the parameters of a parameterized test
     * which generates the name.
     */
    name?: string | ((params?: Params) => string)
    /**
     * An optional array of parameters. For each of these parameters a new test is executed.
     */
    params?: Params[],
    /**
     * When set to `true` the `itOnly` function will be called instead of the `it` function for this test.
     */
    only?: boolean
}

export type TestOptionsInput<Params> = TestOptions<Params> | string

export interface PreparedTestOptions<Params> {
    name: (params?: Params) => string
    params?: Params[],
    only: boolean,
}

/**
 * Validates and prepares the test options as handed to the decorator to be able
 * to operate on them fearlessly inside the `@test` function.
 *
 * @param options The options as provided by the user.
 *
 * @return The validated and prepared options for `@test`.
 */
export function parseTestOptions<Params>(options?: TestOptionsInput<Params>): PreparedTestOptions<Params> {
    if (typeof options === "string") {
        return {
            name: () => options,
            only: false,
        }
    }
    if (typeof options !== "object") {
        throw new Error("Test options need to be either a string or an object.")
    }
    if (options === null) {
        throw new Error("Test options can not be null.")
    }
    const { name: originalName, params, only } = options
    if (typeof originalName !== "function" && typeof originalName !== "string" && originalName !== undefined) {
        throw new Error("Option 'name' needs to be either a string or a function or undefined.")
    }
    let name: () => string
    if (typeof originalName === "function") {
        name = originalName
    }
    if (typeof originalName === "string") {
        name = () => originalName
    }
    if (params !== undefined && !Array.isArray(params)) {
        throw new Error("Option 'params' needs to be an array.")
    }
    return { name, params, only }
}

/**
 * Checks that the provided object is compatible with the `TestOptionsInput` interface.
 *
 * @param input Anything.
 *
 * @return `true if the input is compatible and `false` otherwise.
 */
export function isTestOptionsInput<Params>(input: any): input is TestOptionsInput<Params> {
    const validKeys = ["name", "params", "only"]
    if (!input) { return false }
    if (typeof input === "string") { return true }
    if (input.constructor !== Object) { return false }
    if (Object.keys(input).some(key => !validKeys.includes(key))) { return false }
    return true
}

export interface SuiteOptions {
    /**
     * The name of the suite which will be handed to the `describe` function.
     */
    name?: string
    /**
     * If set to `true` the `describeOnly` function will be called instead of the `describe` function.
     */
    only?: boolean
}

export type SuiteOptionsInput = SuiteOptions | string

export interface PreparedSuiteOptions {
    name: string
    only: boolean
}

/**
 * Validates and prepares the suite options as handed to the decorator to be able
 * to operate on them fearlessly inside the `@suite` function.
 *
 * @param options The options as provided by the user.
 *
 * @return The validated and prepared options for `@suite`.
 */
export function parseSuiteOptions(options?: SuiteOptionsInput): PreparedSuiteOptions {
    if (typeof options === "string") {
        return {
            name: options,
            only: false,
        }
    }
    if (typeof options !== "object") {
        throw new Error("Suite options need to be either a string or an object.")
    }
    if (options === null) {
        throw new Error("Suite options can not be null.")
    }
    const { name, only } = options
    if (name !== undefined && typeof name !== "string") {
        throw new Error("Option 'name' needs to be either a string or a function.")
    }
    return { name, only }
}

/**
 * Checks that the provided object is compatible with the `SuiteOptionsInput` interface.
 *
 * @param input Anything.
 *
 * @return `true if the input is compatible and `false` otherwise.
 */
export function isSuiteOptionsInput(input: any): input is SuiteOptionsInput {
    const validKeys = ["name", "only"]
    if (!input) { return false }
    if (typeof input === "string") { return true }
    if (typeof input === "function") { return false }
    if (Object.keys(input).some(key => !validKeys.includes(key))) { return false }
    return true
}
