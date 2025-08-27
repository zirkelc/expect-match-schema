import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RawMatcherFn, SyncExpectationResult } from '@vitest/expect';

interface CustomMatchers<R = unknown> {
  toMatchSchema: (expected: StandardSchemaV1) => Promise<R>;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

export const toMatchSchema: RawMatcherFn = function (
  this,
  received,
  expected,
): SyncExpectationResult {
  const { matcherHint, printReceived, printExpected, BOLD_WEIGHT } = this.utils;

  if (!expected['~standard']) {
    throw new TypeError('Expected schema does not implement standard schema');
  }

  const schema = expected as StandardSchemaV1;

  const result = schema['~standard'].validate(received);
  if (result instanceof Promise) {
    throw new TypeError('Schema validation must be synchronous');
  }

  if (result.issues) {
    return {
      pass: false,
      message: () =>
        `Received value does not match expected schema:

${BOLD_WEIGHT('Received:')}
${printReceived(received)}

${BOLD_WEIGHT('Issues:')}
${JSON.stringify(result.issues, null, 2)}`,
    };
  }

  return {
    pass: true,
    message: () => '',
  };
};
