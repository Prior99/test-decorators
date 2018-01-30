import { test as testDecorator } from "../test"
import { suite } from "../suite"
import { configure, It, Describe } from "../configure"

describe("`suite`", () => {
    let mockIt: jest.Mock<It>
    let mockItOnly: jest.Mock<It>
    let mockDescribe: jest.Mock<Describe>
    let mockDescribeOnly: jest.Mock<Describe>

    beforeEach(() => {
        mockIt = jest.fn()
        mockItOnly = jest.fn()
        mockDescribe = jest.fn()
        mockDescribeOnly = jest.fn()
        configure({
            it: mockIt,
            itOnly: mockItOnly,
            describe: mockDescribe,
            describeOnly: mockDescribeOnly,
        })
    })

    test("without a configuration", () => {
        @suite
        class A {
            @testDecorator
            private testSomething() { return }
        }
        expect(mockDescribe.mock.calls).toMatchSnapshot()
    })

    test("with `describe` not being configured", () => {
        configure({ it, describe: undefined })
        expect(() => {
            @suite
            class A {
                @testDecorator
                private testSomething() { return }
            }
        }).toThrowErrorMatchingSnapshot()
    })

    test("with `only` set to `true` and `describeOnly` not being configured", () => {
        configure({ it, describe, describeOnly: undefined })
        expect(() => {
            @suite({ only: true })
            class A {
                @testDecorator
                private testSomething() { return }
            }
        }).toThrowErrorMatchingSnapshot()
    })

    test("the constructor is called", () => {
        const mockConstructorImpl = jest.fn()
        @suite
        class A {
            constructor() {
                mockConstructorImpl()
            }
        }
        mockDescribe.mock.calls[0][1]()
        expect(mockConstructorImpl).toHaveBeenCalledTimes(1)
    })

    test("parameterized tests are called with `this` set to a valid instance of the decorated class", () => {
        const mockTestImpl = jest.fn()
        @suite
        class A {
            @testDecorator
            public someTest() { mockTestImpl(this) }
        }
        expect(mockDescribe).toHaveBeenCalledTimes(1)
        mockDescribe.mock.calls[0][1]()
        expect(mockIt).toHaveBeenCalledTimes(1)
        mockIt.mock.calls[0][1]()
        expect(mockTestImpl).toHaveBeenCalledTimes(1)
        expect(mockTestImpl.mock.calls[0][0].constructor).toBe(A)
    })
})
