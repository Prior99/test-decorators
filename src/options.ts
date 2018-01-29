export interface TestOptions<Params extends Object> {
    name?: string | ((params?: Params) => string)
    params?: Params[],
    only?: boolean
}

export type TestOptionsInput<Params> = TestOptions<Params> | string

export interface PreparedTestOptions<Params extends Object> {
    name: (params?: Params) => string
    params?: Params[],
    only: boolean,
}

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
    const { name: originalName, params, only } = options
    if (typeof originalName !== "function" && typeof originalName !== "string") {
        throw new Error("Option 'name' needs to be either a string or a function.")
    }
    const name = typeof originalName === "function" ? originalName : () => originalName
    if (!Array.isArray(params)) {
        throw new Error("Option 'params' needs to be an array.")
    }
    return { name, params, only }
}

export function isTestOptionsInput<Params extends Object>(input: any): input is TestOptionsInput<Params> {
    if (typeof input === "string") { return true }
    if (input.constructor !== Object) { return false }
    return true
}

export interface SuiteOptions {
    name?: string
    only?: boolean
}

export type SuiteOptionsInput = SuiteOptions | string

export interface PreparedSuiteOptions {
    name: string
    only: boolean
}

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
    const { name, only } = options
    if (typeof name !== "string") {
        throw new Error("Option 'name' needs to be either a string or a function.")
    }
    return { name, only }
}

export function isSuiteOptionsInput(input: any): input is SuiteOptionsInput {
    if (typeof input === "string") { return true }
    if (typeof input === "function") { return false }
    return true
}
