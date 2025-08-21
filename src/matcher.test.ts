import type { StandardSchemaV1 } from '@standard-schema/spec';
import { type } from 'arktype';
import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { z } from 'zod';
import { toMatchSchema } from './matcher.js';

expect.extend({
  toMatchSchema,
});

describe('toMatchSchema', () => {
  test('should throw an error for invalid schemas', () => {
    const invalidSchema = { name: 'not a schema' } as any;
    expect(() => expect('test').toMatchSchema(invalidSchema)).toThrow(
      'Expected schema does not implement standard schema',
    );
  });

  test('should throw an error for async schemas', () => {
    const asyncSchema: StandardSchemaV1 = {
      '~standard': {
        validate: () => Promise.resolve({ value: 'test' }),
        vendor: 'test',
        version: 1,
      },
    };
    expect(() => expect('test').toMatchSchema(asyncSchema)).toThrow(
      'Schema validation must be synchronous',
    );
  });

  describe('Zod schema', () => {
    test('should pass for valid data', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const validData = { name: 'John', age: 30 };
      expect(validData).toMatchSchema(schema);
    });

    test('should fail for invalid data', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const invalidData = { name: 'John', age: 'thirty' };
      expect(() => expect(invalidData).toMatchSchema(schema)).toThrow(
        'Received value does not match expected schema',
      );
    });
  });

  describe('Valibot schema', () => {
    test('should pass for valid data', () => {
      const schema = v.object({
        name: v.string(),
        age: v.number(),
      });

      const validData = { name: 'Jane', age: 25 };
      expect(validData).toMatchSchema(schema);
    });

    test('should fail for invalid data', () => {
      const schema = v.object({
        name: v.string(),
        age: v.number(),
      });

      const invalidData = { name: 123, age: 25 };
      expect(() => expect(invalidData).toMatchSchema(schema)).toThrow(
        'Received value does not match expected schema',
      );
    });
  });

  describe('ArkType schema', () => {
    test('should pass for valid data', () => {
      const schema = type({
        name: 'string',
        age: 'number',
      });

      const validData = { name: 'Bob', age: 35 };
      expect(validData).toMatchSchema(schema);
    });

    test('should fail for invalid data', () => {
      const schema = type({
        name: 'string',
        age: 'number',
      });

      const invalidData = { name: 'Bob', age: 'thirty-five' };
      expect(() => expect(invalidData).toMatchSchema(schema)).toThrow(
        'Received value does not match expected schema',
      );
    });
  });
});
