import { suite, test, beforeAll, beforeEach } from "../../../dist";
import { add } from "../foo";

let testCalls = 0;
let beforeCalls = 0;

@suite
class FooTest {
    
    @beforeAll
    beforeAllAdd() {
        beforeCalls += 1
    }
  
    @beforeEach
    beforeEachAdd() {
        beforeCalls += 1
    }

    @test("Adds two numbers")
    testAddNumbers() {
        testCalls += 1
        expect(add(1, 1)).toBe(2)
    }

    @test({
        name: ({ a, b, result }) => `Sums ${a} and ${b} correctly to ${result}`,
        params: [
            { a: 1, b: 2, result: 3 },
            { a: 5, b: 5, result: 10 },
            { a: -1, b: 1, result: 0 },
        ]
    })
    testAddParameterized({ a, b, result }) {
        testCalls += 1
        expect(add(a, b)).toBe(result)
    }

    @test("The suite should have executed 5 tests and 6 before-calls")
    testAddAfterBeforeEach() {
        testCalls += 1
         // We expect 5 test-calls as a result of
         //  1 test-call for the first test and
         //  3 test-calls for the parameterized test and
         //  1 test-call for this test.
        expect(testCalls).toBe(5)
         // We expect 6 before-calls as a result of
         //  1 beforeAll-call and
         //  1 beforeEach-call before the first test and
         //  3 beforeEach-calls before each of the parameterized executions of the second test and
         //  1 beforeEach-call before this test.
        expect(beforeCalls).toBe(6)        
    }
}
