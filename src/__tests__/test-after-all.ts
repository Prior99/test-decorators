import { getTests, test as testDecorator } from "../test"
import { getAfterAlls, afterAll as afterAllDecorator } from "../after-all"
import { configure, It, AfterAll } from "../configure"

describe("`afterAll`", () => {
    let mockIt: jest.Mock<It>
    let mockAfterAll: jest.Mock<AfterAll>
    beforeEach(() => {
        mockIt = jest.fn()
        mockAfterAll = jest.fn()
        configure({ it: mockIt, afterAll: mockAfterAll, describe })
    })

    test("without a configuration and without test", () => {
        class A {
            @afterAllDecorator
            private executeSomethingAfterAll() { return }
        }
        expect(getAfterAlls(A).length).toBe(1)
        getAfterAlls(A)[0](new A())
        expect(mockAfterAll.mock.calls).toMatchSnapshot()
    })

    test("without any configuration and with a test", () => {
        class A {
            @afterAllDecorator
            private executeSomethingAfterAll() { return }
            @testDecorator
            private testSomething() { return }
        }
        expect(getAfterAlls(A).length).toBe(1)
        getAfterAlls(A)[0](undefined)
        expect(mockAfterAll.mock.calls).toMatchSnapshot()
    })

    test("with no `afterAll` provided", () => {
        configure({
            it: mockIt,
            afterAll: undefined,
            describe,
        })
        expect(() => {
            class A {
                @afterAllDecorator
                private testSomething() { return }
            }
        }).toThrowErrorMatchingSnapshot()
    })
})
