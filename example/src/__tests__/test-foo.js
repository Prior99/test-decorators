import { suite, test, beforeAll } from "../../../dist";
import { add } from "../foo";

@suite
class FooTest {
    @test("Adds two numbers")
    testAdd() {
        expect(add(10, 5)).toBe(15);
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
        expect(add(a, b)).toBe(result)
    }
}
