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
  collectCoverageFrom: [
    '**/*.ts',
    '!**/node_modules/**',
    '!**/*rc.*',
    '!**/*.config.*',
    '!**/*.spec.ts',
    '!**/db/migrations/**',
    '!**/src/web/**',
    '!**/src/shared/lib/**', // remove at some point?
    '!**/src/api/decorators/**', // remove at some point
    '!**/src/api/handlers/**', // remove at some point
    '!**/src/db/**', // remove at some point
    '!**/src/services/organization.service.ts' // remove at some point
  ],
  coverageReporters: sharedJestConfig.coverageReporters,
  coverageThreshold: sharedJestConfig.coverageThreshold
};
export default config;
