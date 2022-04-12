import type { Config } from '@jest/types';

import { sharedJestConfig } from './shared-jest.config';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  testMatch: [
    '**/*.spec.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/web/',
    '<rootDir>/cypress/'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/web/',
    '<rootDir>/cypress/'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  coverageReporters: sharedJestConfig.coverageReporters,
  coverageThreshold: sharedJestConfig.coverageThreshold
};
export default config;
