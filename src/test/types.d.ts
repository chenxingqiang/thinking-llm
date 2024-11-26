/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

declare module 'vitest' {
  export * from 'vitest/dist/index';
}

declare module '@testing-library/jest-dom' {
  export * from '@testing-library/jest-dom/matchers';
} 