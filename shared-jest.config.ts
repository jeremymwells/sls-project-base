// import type { Config } from '@jest/types';
// import { ConfigGlobals } from '@jest/types/build/Config';
const bottom = 2;
export const sharedJestConfig = {
  coverageReporters: ['lcov', 'text'] as any,
  coverageThreshold: {
    global: {
      lines: Number(process.env.LINES_COVERAGE || '0') || bottom || 75,
      branches: Number(process.env.BRANCHES_COVERAGE || '0') || bottom || 75,
      functions: Number(process.env.FUNCTIONS_COVERAGE || '0') || bottom || 75,
      statements: Number(process.env.STATEMENTS_COVERAGE || '0') || bottom || 75
    }
  } as any
};
