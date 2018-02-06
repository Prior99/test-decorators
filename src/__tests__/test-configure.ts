import { configure, configuration, initializeConfiguration } from "../configure"

test("initializing the configuration in a browser", () => {
    initializeConfiguration()
    expect(configuration.beforeAll).toBe(beforeAll)
    expect(configuration.it).toBe(it)
    expect(configuration.itOnly).toBe(it.only)
    expect(configuration.describe).toBe(describe)
    expect(configuration.describeOnly).toBe(describe.only)
})

test("changing the configuration", () => {
    const it = jest.fn()
    const itOnly = jest.fn()
    const describe = jest.fn()
    const describeOnly = jest.fn()
    configure({ it, itOnly, describe, describeOnly })
    expect(configuration.it).toBe(it)
    expect(configuration.itOnly).toBe(itOnly)
    expect(configuration.describe).toBe(describe)
    expect(configuration.describeOnly).toBe(describeOnly)
})
