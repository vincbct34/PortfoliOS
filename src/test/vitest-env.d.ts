import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  /* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any */
  interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}

  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<unknown, void> {}
  /* eslint-enable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any */
}

export {};
