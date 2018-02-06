import { getTests, test as testDecorator } from "../test"
import { getBeforeAlls, beforeAll as beforeAllDecorator } from "../before-all"
import { configure, It, BeforeAll } from "../configure"

describe("`beforeAll`", () => {
    let mockIt: jest.Mock<It>
    let mockBeforeAll: jest.Mock<BeforeAll>
    beforeAll(() => {
        mockIt = jest.fn()
        mockBeforeAll = jest.fn()
        configure({ it: mockIt, beforeAll: mockBeforeAll, describe })
    })

    test("without a configuration and without test", () => {
        class A {
            @beforeAllDecorator
            private executeSomethingBeforeAll() { return }
        }
        expect(getBeforeAlls(A).length).toBe(1)
        getBeforeAlls(A)[0](new A())
        expect(mockBeforeAll.mock.calls).toMatchSnapshot()
    })

    test("without any configuration and with a test", () => {
        class A {
            @beforeAllDecorator
            private executeSomethingBeforeAll() { return }
            @testDecorator
            private testSomething() { return }
        }
        expect(getBeforeAlls(A).length).toBe(1)
        getBeforeAlls(A)[0](undefined)
        expect(mockBeforeAll.mock.calls).toMatchSnapshot()
    })

    test("with no `beforeAll` provided", () => {
        configure({
            it: mockIt,
            beforeAll: undefined,
            describe,
        })
        expect(() => {
            class A {
                @beforeAllDecorator
                private testSomething() { return }
            }
        }).toThrowErrorMatchingSnapshot()
    })
})
