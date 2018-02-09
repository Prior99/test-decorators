import { suite, test, beforeAll, beforeEach, afterAll, afterEach } from "../index"

@suite
class SuperA {
    protected executedFunctions: string[] = []
    protected isSuperClass = true
    protected preTestCondition: string

    @beforeEach
    protected executeParentBeforeEach() {
        this.executedFunctions.push("PARENT BEFORE EACH")
    }
    @beforeAll
    protected executeParentBeforeAll() {
        this.executedFunctions.push("PARENT BEFORE ALL")
    }
    @afterAll
    protected executeParentAfterAll() {
        this.executedFunctions.push("PARENT AFTER ALL")
    }
    @afterEach
    protected executeParentAfterEach() {
        this.executedFunctions.push("PARENT AFTER EACH")
    }
    @test(`Parent test-run is run No. 1`)
    private testParent(run: number) {
        this.executedFunctions.push("PARENT TEST")
        if (this.isSuperClass){
            // If this test is being executed as a `super-class` test,
            // then it must be the `3rd` function called after
            // 1st the parent's beforeAll call and
            // 2nd the parent's beforeEach call.
            expect(3).toBe(this.executedFunctions.length)
        } else {
            // If this test is being executed as a `child-class` test,
            // then it must be the `5th` function called after
            // 1st the parent's beforeAll call and
            // 2nd the parent's beforeEach call and
            // 3rd the child's beforeAll call and
            // 4th the child's beforeEach call.
            expect(5).toBe(this.executedFunctions.length)
        }
    }
}
@suite
class A extends SuperA {
    protected isSuperClass = false
    @beforeEach
    protected executeParentBeforeEach() {
        this.executedFunctions.push("CHILD BEFORE EACH")
    }
    @beforeAll
    protected executeParentBeforeAll() {
        this.executedFunctions.push("CHILD BEFORE ALL")
    }
    @afterEach
    protected executeParentAfterEach() {
        this.executedFunctions.push("CHILD AFTER EACH")
    }
    @afterAll
    protected executeParentAfterAll() {
        this.executedFunctions.push("CHILD AFTER ALL")
        // Match the executed-functions array against the expected execution order.

        expect(this.executedFunctions).toMatchSnapshot()
    }
    @test({
        name: (testNr) => `Does execute parameterized test Nr.${testNr} in child in correct order`,
        params: [1,2],
    })
    private testAddParameterized(testNr: number) {
        this.executedFunctions.push(`CHILD TEST PARAMS ${testNr}`)
    }
}
