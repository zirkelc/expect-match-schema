# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript library that provides a custom Vitest/Jest matcher `toMatchSchema` for validating data against schema libraries that implement the Standard Schema specification (@standard-schema/spec). The matcher supports popular schema validation libraries like Zod, Valibot, and ArkType.

## Development Commands

- **Build**: `pnpm build` (uses tsdown to build both ESM and CJS formats)
- **Test**: `pnpm test` (runs Vitest tests)
- **Lint**: `pnpm lint` (runs Biome linter with auto-fix)
- **Type Check**: `pnpm typecheck` (validates package types with @arethetypeswrong/cli)
- **Prepare for publish**: `pnpm prepublishOnly` (builds and type checks)

## Architecture

### Core Files
- `src/matcher.ts` - Main implementation of the `toMatchSchema` matcher function
- `src/index.ts` - Entry point that exports the matcher
- `src/matcher.test.ts` - Test suite for the matcher functionality

### Key Architecture Details

The library implements a single custom matcher function that:
1. Validates that the expected value implements the Standard Schema specification (has `~standard` property)
2. Calls the schema's synchronous validation method
3. Returns appropriate pass/fail results with error details from schema validation issues

The matcher extends Vitest's expectation interface through TypeScript module augmentation to provide type safety.

### Build System

Uses tsdown (not unbuild as mentioned in README template) to generate dual ESM/CJS output with proper TypeScript declarations. The package.json is configured for ESM by default with dual exports.

### Testing Framework

Uses Vitest with the matcher extending the expect interface. Tests should validate integration with various Standard Schema-compliant libraries (Zod, Valibot, ArkType).

### Code Quality

- Biome for linting and formatting (configured for single quotes, semicolons, trailing commas)
- Husky for pre-commit hooks
- Package manager: pnpm 9.0.0