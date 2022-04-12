// import type { Config } from '@jest/types';
// import { ConfigGlobals } from '@jest/types/build/Config';

export const sharedJestConfig = {
  coverageReporters: ['lcov', 'text'] as any,
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  } as any
};
