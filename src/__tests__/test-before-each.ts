import { getTests, test as testDecorator } from "../test"
import { getBeforeEachs, beforeEach as beforeEachDecorator } from "../before-each"
import { configure, It, BeforeEach } from "../configure"

describe("`beforeEach`", () => {
    let mockIt: jest.Mock<It>
    let mockBeforeEach: jest.Mock<BeforeEach>
    beforeEach(() => {
        mockIt = jest.fn()
        mockBeforeEach = jest.fn()
        configure({ it: mockIt, beforeEach: mockBeforeEach, describe })
    })

    test("without a configuration and without test", () => {
        class A {
            @beforeEachDecorator
            private executeSomethingBeforeEachTest() { return }
        }
        expect(getBeforeEachs(A).length).toBe(1)
        getBeforeEachs(A)[0](new A())
        expect(mockBeforeEach.mock.calls).toMatchSnapshot()
    })

    test("without any configuration and with a test", () => {
        class A {
            @beforeEachDecorator
            private executeSomethingBeforeEachTest() { return }
            @testDecorator
            private testSomething() { return }
        }
        expect(getBeforeEachs(A).length).toBe(1)
        getBeforeEachs(A)[0](undefined)
        expect(mockBeforeEach.mock.calls).toMatchSnapshot()
    })

    test("with no `beforeEach` provided", () => {
        configure({
            it: mockIt,
            beforeEach: undefined,
            describe,
        })
        expect(() => {
            class A {
                @beforeEachDecorator
                private testSomething() { return }
            }
        }).toThrowErrorMatchingSnapshot()
    })
})
