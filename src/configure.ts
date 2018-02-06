export type BeforeEach = () => Promise<void> | void

export type BeforeAll = (fn: BeforeAllFunction) => Promise<void> | void
export type BeforeAllFunction = (done?: () => void) => Promise<void> | void

export type It = (name: string, fn: ItFunction) => void
export type ItFunction = (done?: () => void) => Promise<void> | void

export type Describe = (name: string, fn: DescribeFunction) => void
export type DescribeFunction = () => Promise<void> | void

/**
 * Options provided to `configure` for setting up the test framework.
 */
export interface ConfigureOptions {
    /**
     * The function called once per suite before all tests.
     */
    beforeAll?: BeforeAll,
    /**
     * The function called once per suite before each test.
     */
    beforeEach?: BeforeEach,
    /**
     * The function called for each test.
     */
    it: It,
    /**
     * The function called for each test if `only` is set to `true`.
     */
    itOnly?: It,
    /**
     * The function called for each suite.
     */
    describe: Describe,
    /**
     * The function called for each suite if `only` is set to `true`.
     */
    describeOnly?: Describe
}

export let configuration: ConfigureOptions

/**
 * Call this function in the setup code of your test runner to provide the functions
 * to be called for each suite and each test.
 */
export function configure(options: ConfigureOptions) {
    Object.assign(configuration, options)
}

declare var global: any

/**
 * Initialize the configuration with some default values working out of the box for jest an mocha.
 */
export function initializeConfiguration() {
    // Shamelessly adapted from https://github.com/purposeindustries/window-or-global
    // istanbul ignore next
    const globalOrWindow = (typeof self === "object" && self.self === self && self) ||
        (typeof global === "object" && global.global === global && global)

    configuration = {
        beforeEach: (globalOrWindow as any).beforeEach,
        beforeAll: (globalOrWindow as any).beforeAll,
        it: (globalOrWindow as any).it,
        describe: (globalOrWindow as any).describe,
        describeOnly: (globalOrWindow as any).describe.only,
        itOnly: (globalOrWindow as any).it.only,
    }
}

initializeConfiguration()
