# Test Decorators

[![npm](https://img.shields.io/npm/v/test-decorators.svg)](https://www.npmjs.com/package/test-decorators)
[![Build Status](https://travis-ci.org/Prior99/test-decorators.svg?branch=master)](https://travis-ci.org/Prior99/test-decorators)
[![Coverage Status](https://coveralls.io/repos/github/Prior99/test-decorators/badge.svg?branch=master)](https://coveralls.io/github/Prior99/test-decorators?branch=master)

Test decorators provides a set of decorators to run javascript unit tests with.

## Table of contents

 * [Test Decorators](#test-decorators)
     * [Table of contents](#table-of-contents)
     * [Suites](#suites)
     * [Tests](#tests)
     * [Parameterizing](#parameterizing)
     * [Configuration](#configuration)
     * [Contributing](#contributing)
         * [Building](#building)
         * [Running the tests with coverage](#running-the-tests-with-coverage)
         * [Linting](#linting)
         * [Starting the example](#starting-the-example)
     * [Contributors](#contributors)

## Suites

Instead of writing `describe`, define a class and decorate it with `@suite`:

```typescript
import { suite } from "test-decorators";

@suite
class TestSuite {
}
```

The decorator takes optional options as arguments, to provide a name or have `describe.only` called
instead:

```typescript
import { suite } from "test-decorators";

@suite("The name provided to describe")
class TestSuite {
}
```

```typescript
@suite({
    name: "The name provided to describe",
    only: true
})
class TestSuite {
}
```

If no name is provided, the name of the class is used.

## Tests

Instead of writing `it`, define a class decorated with `@suite` and provide methods decorated with `@test`:

```typescript
import { suite, test } from "test-decorators";

@suite
class TestSuite {
    @test
    private testSomething() {
        ...
    }
}
```

The decorator takes optional options as arguments, to provide a name or have `test.only` called
instead:

```typescript
@test("test something")
private testSomething() {
    ...
}
```

```typescript
@test({
    name: "test something",
    only: true
})
private testSomething() {
    ...
}
```

If no name is provided, the name of the method is used.

## Parameterizing

It is possible to parameterize the tests to have them called with different inputs:

```typescript
@test({
    name: "test something",
    only: true,
    params: [-1, 0, 1, 10, 1000, 2000]
})
private testSomething(input) {
    ...
}
```

The test will be executed once with every parameter specified.

The name can be generated from the parameters to increase readability:

```typescript
@test({
    name: ({ a, b, expected }) => `${a} + ${b} is ${expected}`,
    only: true,
    params: [
        { a: -1, b: 1, expected: 0 },
        { a: 0, b: 0, expected: 0 },
        { a: 100, b: 1, expected: 101 }
    ]
})
private testSomething({ a, b, expected }) {
    expect(a + b).tobe(expected);
}
```

## Configuration

This library should work out of the box with jest and mocha compatible framework without any
additional configuration needed. Otherwise it is possible to configure it and provide
mocha-compatible functions:

```typescript
import { configure } from "test-decorators"

configure({
    it: () => { ... },
    itOnly: () => { ... },
    describe: () => { ... },
    describeOnly: () => { ... },
});
```

## Contributing

Yarn is used instead of npm, so make sure it is installed, probably: `npm install -g yarn`.

Install all dependencies using

```
yarn install
```

### Building

In order to build the code:

```
yarn build
```

### Running the tests with coverage

```
yarn test
```

### Linting

```
yarn lint
```

### Starting the example

```
cd example
yarn test
```

## Contributors

 - Frederick Gnodtke
 - Sergej Kasper
