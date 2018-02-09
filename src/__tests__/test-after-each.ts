import { getTests, test as testDecorator } from "../test"
import { getAfterEachs, afterEach as afterEachDecorator } from "../after-each"
import { configure, It, AfterEach } from "../configure"

describe("`afterEach`", () => {
    let mockIt: jest.Mock<It>
    let mockAfterEach: jest.Mock<AfterEach>
    beforeEach(() => {
        mockIt = jest.fn()
        mockAfterEach = jest.fn()
        configure({ it: mockIt, afterEach: mockAfterEach, describe })
    })

    test("without a configuration and without test", () => {
        class A {
            @afterEachDecorator
            private executeSomethingAfterEachTest() { return }
        }
        expect(getAfterEachs(A).length).toBe(1)
        getAfterEachs(A)[0](new A())
        expect(mockAfterEach.mock.calls).toMatchSnapshot()
    })

    test("without any configuration and with a test", () => {
        class A {
            @afterEachDecorator
            private executeSomethingAfterEachTest() { return }
            @testDecorator
            private testSomething() { return }
        }
        expect(getAfterEachs(A).length).toBe(1)
        getAfterEachs(A)[0](undefined)
        expect(mockAfterEach.mock.calls).toMatchSnapshot()
    })

    test("with no `afterEach` provided", () => {
        configure({
            it: mockIt,
            afterEach: undefined,
            describe,
        })
        expect(() => {
            class A {
                @afterEachDecorator
                private testSomething() { return }
            }
        }).toThrowErrorMatchingSnapshot()
    })
})
