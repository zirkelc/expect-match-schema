[![npm](https://img.shields.io/npm/dt/expect-match-schema?label=expect-match-schema)](https://www.npmjs.com/package/expect-match-schema)

# `expect.toMatchSchema()`

This package provides a custom matcher for Vitest and Jest to check data against a [standard schema](https://github.com/standard-schema/standard-schema) like [Zod](https://zod.dev/), [ArkType](https://arktype.io/), [Valibot](https://valibot.dev/) and others.

<img width="1023" height="514" alt="image" src="https://github.com/user-attachments/assets/233729ac-3505-469c-8541-e66cd94adf58" />


## [Standard Schema](https://github.com/standard-schema/standard-schema)

> Standard Schema is a common interface designed to be implemented by JavaScript and TypeScript schema libraries.
> The goal is to make it easier for ecosystem tools to accept user-defined type validators, without needing to write custom logic or adapters for each supported library. And since Standard Schema is a specification, they can do so with no additional runtime dependencies. Integrate once, validate anywhere.

## Install 

Install `expect-match-schema` as a dev dependency:

```bash
pnpm add -D expect-match-schema
```

## Usage

Import `toMatchSchema` and use [`expect.extend`](https://vitest.dev/api/expect.html#expect-extend) to extend the default matchers.

```ts
import { describe, expect, test } from 'vitest';
import { toMatchSchema } from 'expect-match-schema';
import { z } from 'zod';


expect.extend({ toMatchSchema });

test('should match Zod schema', () => {
  expect('john@example.com').toMatchSchema(z.email());
  expect('https://example.com').toMatchSchema(z.url());
  expect({ name: 'John', age: 30 }).toMatchSchema(
    z.object({
      name: z.string(),
      age: z.number(),
    })
  );
});
```

## Asymmetric Matchers

You can also use `expect.toMatchSchema()` as an asymmetric matcher with `expect.objectContaining`, `expect.arrayContaining`, and similar matchers:

```ts
test('should match Zod schema', () => {
  const response = {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      id: 123,
    },
    timestamp: new Date().toISOString(),
  };

  expect(response).toEqual(
    expect.objectContaining({
      user: expect.toMatchSchema(
        z.object({
          name: z.string(),
          email: z.email(),
        })
      ),
      timestamp: expect.toMatchSchema(z.iso.datetime()),
    });
  });
});
```

## API

### `toMatchSchema(schema: StandardSchemaV1)`

Accepts any schema that implements the [Standard Schema specification](https://github.com/standard-schema/standard-schema?tab=readme-ov-file#what-schema-libraries-implement-the-spec). The matcher expects a synchronous schema and will throw an error if the schema is asynchronous.

## License

MIT
