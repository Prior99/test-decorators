import { test as testDecorator } from "../test"
import { beforeAll as beforeAllDecorator } from "../before-all"
import { suite } from "../suite"
import { configure, It, Describe, BeforeAll } from "../configure"

describe("`suite`", () => {
    let mockIt: jest.Mock<It>
    let mockItOnly: jest.Mock<It>
    let mockDescribe: jest.Mock<Describe>
    let mockDescribeOnly: jest.Mock<Describe>
    let mockBeforeAll: jest.Mock<BeforeAll>

    beforeEach(() => {
        mockIt = jest.fn()
        mockItOnly = jest.fn()
        mockDescribe = jest.fn()
        mockDescribeOnly = jest.fn()
        mockBeforeAll = jest.fn()
        configure({
            it: mockIt,
            itOnly: mockItOnly,
            describe: mockDescribe,
            describeOnly: mockDescribeOnly,
            beforeAll: mockBeforeAll,
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

    test("beforeAll-functions are called in proper order before the tests and sets test values reliably", () => {
        const mockTestImpl = jest.fn()
        @suite
        class A {
            public initialConditions: string
            @beforeAllDecorator
            public setInitialConditionsOnInstance1() {
                this.initialConditions = "some initial"
            }
            @beforeAllDecorator
            public setInitialConditionsOnInstance2() {
                this.initialConditions += " value"
            }
            @testDecorator
            public runTestWithPresetConditions() {
                mockTestImpl(this.initialConditions)
            }
        }
        mockDescribe.mock.calls[0][1]()
        expect(mockBeforeAll).toHaveBeenCalledTimes(2)
        mockBeforeAll.mock.calls[0][0](new A())
        mockBeforeAll.mock.calls[1][0](new A())
        mockIt.mock.calls[0][1]()
        expect(mockTestImpl).toHaveBeenCalledTimes(1)
        expect(mockTestImpl.mock.calls[0][0]).toBe("some initial value")
    })

    test("beforeAll is called before the tests and sets test values reliabily with inheritance", () => {
        const mockTestImplSuper = jest.fn()
        const mockTestImpl = jest.fn()

        @suite
        class SuperA {
            public initialConditions: string

            @beforeAllDecorator
            public setInitialConditionsOnInstance() {
                this.initialConditions = "initial value"
            }
            @testDecorator
            public runParentTestWithPresetConditions() {
                mockTestImplSuper(this.initialConditions)
            }
        }

        @suite
        class A extends SuperA {
            @beforeAllDecorator
            public setInitialConditionsOnInstance() {
                this.initialConditions += " inherited"
            }
            @testDecorator
            public runTestWithPresetConditions() {
                mockTestImpl(this.initialConditions)
            }
        }
        expect(mockDescribe).toHaveBeenCalledTimes(2)
        mockDescribe.mock.calls[0][1]()
        mockDescribe.mock.calls[1][1]()
        expect(mockBeforeAll).toHaveBeenCalledTimes(3)
        mockBeforeAll.mock.calls[0][0]()
        mockBeforeAll.mock.calls[1][0]()
        mockBeforeAll.mock.calls[2][0]()
        // The beforeAll in SuperA is called twice in SuperA
        // and A and the beforeAll in A is called only in A .
        // Thus there should be three beforeAll calls.
        expect(mockIt).toHaveBeenCalledTimes(3)
        mockIt.mock.calls[0][1](new A())
        mockIt.mock.calls[1][1](new A())
        mockIt.mock.calls[2][1](new A())
        expect(mockTestImpl).toHaveBeenCalledTimes(1)
        expect(mockTestImpl.mock.calls[0][0]).toBe("initial value inherited")
        expect(mockTestImplSuper).toHaveBeenCalledTimes(2)
        expect(mockTestImplSuper.mock.calls[0][0]).toBe("initial value")
    })

    test("the superclass and child are only executing their own tests", () => {
        const mockTestImpl = jest.fn()
        @suite
        class SuperA {
            // This test is necessary to create the test-array in the parent,
            // which then is also populated with the child's tests.
            // But since we require the test executor to be an instance of the target in the test-decorator,
            // the child tests are not executed here.
            @testDecorator({
                name: (param) => `some name #${param}`,
                params: [
                    { a: 1, b: 2 },
                ],
            })
            protected testSomethingInTheSuperClass(...args: any[]) { return }
        }
        @suite
        class A extends SuperA {
            // This test should only be executed in the child.
            @testDecorator({
                name: (param) => `some name #${param}`,
                params: [
                    { a: 1, b: 2 },
                ],
            })
            protected testSomethingInTheExtendingClass(...args: any[]) { return }
        }
        expect(mockDescribe).toHaveBeenCalledTimes(2)
        mockDescribe.mock.calls[0][1]()
        mockDescribe.mock.calls[1][1]()
        // There should be two calls because the parent should not execute the child's tests
        // and the child should not execute the parent tests.
        expect(mockIt).toHaveBeenCalledTimes(2)
        expect(mockIt.mock.calls).toMatchSnapshot()
    })

    test("the child to inherit the beforeAlls from the parent without @suite", () => {
        const mockTestImpl = jest.fn()
        class SuperA {
            public initialConditions: string
            // This beforeAll should be considered even though there is no suite.
            @beforeAllDecorator
            public setInitialConditionsOnParent() {
                this.initialConditions = "initial value"
            }
        }
        @suite
        class A extends SuperA {
            // This test should only be executed in the child.
            @beforeAllDecorator
            public setInitialConditionsOnInstance() {
                this.initialConditions += " child"
            }
            @testDecorator
            public runTestWithPresetConditions() {
                mockTestImpl(this.initialConditions)
            }
        }
        expect(mockDescribe).toHaveBeenCalledTimes(1)
        mockDescribe.mock.calls[0][1]()
        expect(mockBeforeAll).toHaveBeenCalledTimes(2)
        mockBeforeAll.mock.calls[0][0]()
        mockBeforeAll.mock.calls[1][0]()
        expect(mockIt).toHaveBeenCalledTimes(1)
        mockIt.mock.calls[0][1](new A())
        expect(mockTestImpl).toHaveBeenCalledTimes(1)
        expect(mockTestImpl.mock.calls[0][0]).toBe("initial value child")
    })
})
