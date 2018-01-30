import { parseTestOptions, parseSuiteOptions, isTestOptionsInput, isSuiteOptionsInput } from "../options"

describe("`parseTestOptions`", () => {
    test("with only a name", () => {
        const options = parseTestOptions("the name of some test")
        expect(options).toMatchSnapshot()
        expect(options.name()).toBe("the name of some test")
    })

    test("with `undefined`", () => {
        expect(() => parseTestOptions(undefined)).toThrowErrorMatchingSnapshot()
    })

    test("with `null`", () => {
        expect(() => parseTestOptions(null)).toThrowErrorMatchingSnapshot() // tslint:disable-line
    })

    test("with a number", () => {
        expect(() => parseTestOptions(9 as any)).toThrowErrorMatchingSnapshot()
    })

    test("with the name being a string", () => {
        const options = parseTestOptions({
            name: "some test name",
        })
        expect(options).toMatchSnapshot()
        expect(options.name()).toBe("some test name")
    })

    test("with the name being a function", () => {
        const mock = jest.fn()
        const options = parseTestOptions({
            name: () => {
                mock()
                return "some test name in a function"
            },
        })
        expect(options).toMatchSnapshot()
        expect(options.name()).toBe("some test name in a function")
        expect(mock).toHaveBeenCalled()
    })

    test("with the name being undefined", () => {
        const options = parseTestOptions({})
        expect(options).toMatchSnapshot()
    })

    test("with the name being a number", () => {
        expect(() => parseTestOptions({ name: 9 } as any)).toThrowErrorMatchingSnapshot()
    })

    test("with the params being an object which is not an array", () => {
        expect(() => parseTestOptions({ params: {} } as any)).toThrowErrorMatchingSnapshot()
    })

    test("with the params being an array", () => {
        const options = parseTestOptions({
            params: [
                { a: 1 },
                { a: 2 },
                { a: 3 },
            ],
        })
        expect(options).toMatchSnapshot()
    })

    test("with only being set to `true`", () => {
        const options = parseTestOptions({
            only: true,
        })
        expect(options).toMatchSnapshot()
    })

    test("with a full configuration", () => {
        const options = parseTestOptions({
            only: true,
            name: "yet another test name",
            params: [1, 2, 3],
        })
        expect(options.name()).toBe("yet another test name")
        expect(options).toMatchSnapshot()
    })
})

describe("`parseSuiteOptions`", () => {
    test("with only a name", () => {
        const options = parseSuiteOptions("the name of some suite")
        expect(options).toMatchSnapshot()
    })

    test("with `undefined`", () => {
        expect(() => parseSuiteOptions(undefined)).toThrowErrorMatchingSnapshot()
    })

    test("with `null`", () => {
        expect(() => parseSuiteOptions(null)).toThrowErrorMatchingSnapshot() // tslint:disable-line
    })

    test("with a number", () => {
        expect(() => parseSuiteOptions(9 as any)).toThrowErrorMatchingSnapshot()
    })

    test("with the name specified", () => {
        const options = parseSuiteOptions({
            name: "some suite name",
        })
        expect(options).toMatchSnapshot()
    })

    test("with the name being undefined", () => {
        const options = parseSuiteOptions({})
        expect(options).toMatchSnapshot()
    })

    test("with the name being a number", () => {
        expect(() => parseSuiteOptions({ name: 9 } as any)).toThrowErrorMatchingSnapshot()
    })

    test("with only being set to `true`", () => {
        const options = parseSuiteOptions({
            only: true,
        })
        expect(options).toMatchSnapshot()
    })

    test("with a full configuration", () => {
        const options = parseSuiteOptions({
            only: true,
            name: "another suite name",
        })
        expect(options).toMatchSnapshot()
    })
})

describe("`isTestOptionsInput`", () => {
    test("doesn't detect a class as options", () => {
        expect(isTestOptionsInput(class A{})).toBe(false)
    })

    test("doesn't detect any instance as options", () => {
        class A {
            public name = "test"
            public only = true
            public params = [1, 2, 3]
        }
        expect(isTestOptionsInput(new A())).toBe(false)
    })

    test("doesn't detect a method as options", () => {
        class A {
            public someMethod() { return }
        }
        const instance = new A()
        expect(isTestOptionsInput(instance.someMethod)).toBe(false)
        expect(isTestOptionsInput(A.prototype.someMethod)).toBe(false)
    })

    test("doesn't detect a function as options", () => {
        expect(isTestOptionsInput(() => { return })).toBe(false)
    })

    test("doesn't detect any unrelated object as options", () => {
        expect(isTestOptionsInput({ someUnknownKey: 10 })).toBe(false)
        expect(isTestOptionsInput({
            someUnknownKey: "test",
            only: true,
            name: "some name",
        })).toBe(false)
    })

    test("doesn't detect null as options", () => {
        expect(isTestOptionsInput(null)).toBe(false) // tslint:disable-line
    })

    test("doesn't detect undefined as options", () => {
        expect(isTestOptionsInput(undefined)).toBe(false)
    })

    test("detects a string as options", () => {
        expect(isTestOptionsInput("some test name")).toBe(true)
    })

    test("detects empty options as options", () => {
        expect(isTestOptionsInput({})).toBe(true)
    })

    test("detects well-defined options as options", () => {
        expect(isTestOptionsInput({ only: true, name: "a test name", params: [] })).toBe(true)
    })
})

describe("`isSuiteOptionsInput`", () => {
    test("doesn't detect a class as options", () => {
        expect(isSuiteOptionsInput(class A{})).toBe(false)
    })

    test("doesn't detect any instance as options", () => {
        class A {
            public name = "test"
            public only = true
            public params = [1, 2, 3]
        }
        expect(isSuiteOptionsInput(new A())).toBe(false)
    })

    test("doesn't detect a method as options", () => {
        class A {
            public someMethod() { return }
        }
        const instance = new A()
        expect(isSuiteOptionsInput(instance.someMethod)).toBe(false)
        expect(isSuiteOptionsInput(A.prototype.someMethod)).toBe(false)
    })

    test("doesn't detect a function as options", () => {
        expect(isSuiteOptionsInput(() => { return })).toBe(false)
    })

    test("doesn't detect any unrelated object as options", () => {
        expect(isSuiteOptionsInput({ someUnknownKey: 10 })).toBe(false)
        expect(isSuiteOptionsInput({
            someUnknownKey: "test",
            only: true,
            name: "some name",
        })).toBe(false)
    })

    test("doesn't detect null as options", () => {
        expect(isSuiteOptionsInput(null)).toBe(false) // tslint:disable-line
    })

    test("doesn't detect undefined as options", () => {
        expect(isSuiteOptionsInput(undefined)).toBe(false)
    })

    test("detects a string as options", () => {
        expect(isSuiteOptionsInput("some suite name")).toBe(true)
    })

    test("detects empty options as options", () => {
        expect(isSuiteOptionsInput({})).toBe(true)
    })

    test("detects well-defined options as options", () => {
        expect(isSuiteOptionsInput({ only: true, name: "a suite name", params: [] })).toBe(true)
    })
})
