import { suite, test, beforeAll, beforeEach } from "../../../dist";
import { add } from "../foo";

let testRuns = 0;
let beforeRuns = 0;

@suite
class FooTest {
    
    @beforeAll
    beforeAllAdd() {
        beforeRuns += 1
    }
  
    @beforeEach
    beforeEachAdd() {
        beforeRuns += 1
    }

    @test("Adds two numbers")
    testAddNumbers() {
        testRuns += 1
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
        testRuns += 1
        expect(add(a, b)).toBe(result)
    }

    @test("The suite should have executed 5 tests and 6 befores")
    testAddAfterBeforeEach() {
        // Each parametri 
        testRuns += 1
        expect(testRuns).toBe(5)
         // This is the result of:
         //  1 beforeAll call
         //  1 beforeEach call before the first test 
         //  3 beforeEach calls before the second test 
         //  1 beforeEAch call before this test.
        expect(beforeRuns).toBe(6)        
    }
}
