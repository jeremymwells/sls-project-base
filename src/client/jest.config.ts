import { Config } from '@jest/types';
import { sharedJestConfig } from '../../shared-jest.config';

// Sync object
const config: Config.InitialOptions = {
  preset: 'jest-expo',
  coverageReporters: sharedJestConfig.coverageReporters,
  coverageThreshold: sharedJestConfig.coverageThreshold,
  collectCoverageFrom: [
    '**/*.ts',
    '**/*.tsx',
    '!**/*test.ts',
    '!**/*test.js',
    '!**/node_modules/**',
    '!**/cypress/**',
  ],
};

export default config;