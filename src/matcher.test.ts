import type { StandardSchemaV1 } from '@standard-schema/spec';
import { type } from 'arktype';
import { toMatchSchema } from 'expect-match-schema';
import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { z } from 'zod';

expect.extend({ toMatchSchema });

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
        email: z.email(),
      });

      const validData = { name: 'John', email: 'john@example.com' };
      expect(validData).toMatchSchema(schema);
    });

    test('should fail for invalid data', () => {
      const schema = z.object({
        name: z.string(),
        email: z.email(),
      });

      const invalidData = { name: 'John', email: 'not-an-email' };
      expect(() => expect(invalidData).toMatchSchema(schema)).toThrow(
        'Received value does not match expected schema',
      );
    });
  });

  describe('Valibot schema', () => {
    test('should pass for valid data', () => {
      const schema = v.object({
        name: v.string(),
        email: v.pipe(v.string(), v.email()),
      });

      const validData = { name: 'Jane', email: 'jane@example.com' };
      expect(validData).toMatchSchema(schema);
    });

    test('should fail for invalid data', () => {
      const schema = v.object({
        name: v.string(),
        email: v.pipe(v.string(), v.email()),
      });

      const invalidData = { name: 123, email: 'jane@example.com' };
      expect(() => expect(invalidData).toMatchSchema(schema)).toThrow(
        'Received value does not match expected schema',
      );
    });
  });

  describe('ArkType schema', () => {
    test('should pass for valid data', () => {
      const schema = type({
        name: 'string',
        email: 'string.email',
      });

      const validData = { name: 'Bob', email: 'bob@example.com' };
      expect(validData).toMatchSchema(schema);
    });

    test('should fail for invalid data', () => {
      const schema = type({
        name: 'string',
        email: 'string.email',
      });

      const invalidData = { name: 'Bob', email: 'not-an-email' };
      expect(() => expect(invalidData).toMatchSchema(schema)).toThrow(
        'Received value does not match expected schema',
      );
    });
  });

  describe('Asymmetric matchers', () => {
    test('should work with expect.toMatchSchema() as asymmetric matcher', () => {
      const urlSchema = z.url();
      const numberSchema = z.number().min(1000);

      const data = {
        website: 'https://example.com',
        port: 8080,
      };

      expect(data).toEqual({
        website: expect.toMatchSchema(urlSchema),
        port: expect.toMatchSchema(numberSchema),
      });
    });

    test('should work with expect.objectContaining', () => {
      const userSchema = z.object({
        name: z.string(),
        email: z.email(),
      });

      const response = {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          id: 123,
        },
        timestamp: Date.now(),
      };

      expect(response).toEqual(
        expect.objectContaining({
          user: expect.toMatchSchema(userSchema),
        }),
      );
    });

    test('should work with expect.arrayContaining', () => {
      const urlSchema = z.url();

      const urls = [
        'https://example.com',
        'https://google.com',
        'https://github.com',
      ];

      expect(urls).toEqual(
        expect.arrayContaining([
          expect.toMatchSchema(urlSchema),
          expect.toMatchSchema(urlSchema),
          expect.toMatchSchema(urlSchema),
        ]),
      );
    });

    test('should fail for invalid data', () => {
      const emailSchema = z.email();

      const data = {
        email: 'not-an-email',
        name: 'John',
      };

      expect(() => {
        expect(data).toEqual({
          email: expect.toMatchSchema(emailSchema),
          name: 'John',
        });
      }).toThrow();
    });
  });
});
