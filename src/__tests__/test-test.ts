import { getTests, test as testDecorator } from "../test"
import { configure, It } from "../configure"

describe("`test`", () => {
    let mockIt: jest.Mock<It>
    let mockItOnly: jest.Mock<It>

    beforeEach(() => {
        mockIt = jest.fn()
        mockItOnly = jest.fn()
        configure({ it: mockIt, itOnly: mockItOnly, describe })
    })

    test("without a configuration", () => {
        class A {
            @testDecorator
            private testSomething() { return }
        }
        expect(getTests(A).length).toBe(1)
        getTests(A)[0](undefined)
        expect(mockIt.mock.calls).toMatchSnapshot()
    })

    test("with a name", () => {
        class A {
            @testDecorator("some name")
            private testSomething() { return }
        }
        expect(getTests(A)).toMatchSnapshot()
    })

    test("with a configuration", () => {
        class A {
            @testDecorator({ name: "some name" })
            private testSomething() { return }
        }
        expect(getTests(A).length).toBe(1)
        getTests(A)[0](undefined)
        expect(mockIt.mock.calls).toMatchSnapshot()
    })

    test("with no `it` function provided", () => {
        configure({
            it: undefined,
            describe,
        })
        expect(() => {
            class A {
                @testDecorator
                private testSomething() { return }
            }
        }).toThrowErrorMatchingSnapshot()
    })

    test("with `only` set to `true` but no `itOnly` function provided", () => {
        configure({
            it,
            describe,
            itOnly: undefined,
        })
        expect(() => {
            class A {
                @testDecorator({ name: "some name", only: true })
                private testSomething() { return }
            }
        }).toThrowErrorMatchingSnapshot()
    })

    test("with `params`", () => {
        class A {
            @testDecorator({
                name: (param) => `some name #${param}`,
                params: [1, 2, 3],
            })
            private testSomething() { return }
        }
        const tests = getTests(A)
        expect(tests.length).toBe(3)
        tests.forEach(storedTest => storedTest(undefined))
        expect(mockIt.mock.calls).toMatchSnapshot()
    })

    test("calling the test when configured with `params`", () => {
        const mockTestImpl = jest.fn()
        class A {
            @testDecorator({
                name: (param) => `some name #${param}`,
                params: [
                    { a: 1, b: 2 },
                    { a: 3, b: 4 },
                ],
            })
            private testSomething(...args: any[]) { mockTestImpl(...args) }
        }
        const tests = getTests(A)
        tests.forEach(storedTest => storedTest(undefined))
        mockIt.mock.calls.forEach(call => call[1]())
        expect(mockTestImpl.mock.calls).toMatchSnapshot()
    })

    test("calling the test when configured without `params`", () => {
        const mockTestImpl = jest.fn()
        class A {
            @testDecorator
            private testSomething(...args: any[]) { mockTestImpl(...args) }
        }
        const tests = getTests(A)
        tests[0](undefined)
        mockIt.mock.calls[0][1]()
        expect(mockTestImpl.mock.calls).toMatchSnapshot()
    })
})
