import type { Config } from '@jest/types';
import { sharedJestConfig } from '../../shared-jest.config';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,

  testMatch: [
    "**/*.test.ts",
    "**/*.test.tsx"
  ],
  testPathIgnorePatterns: [
    // "<rootDir>/**/*.scss",
    '<rootDir>/node_modules/',
    '<rootDir>/cypress/',
    "src/config.ts",
    "src/index.tsx",
    "src/reportWebVitals.ts",
    "src/setupProxy.js"
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/cypress/',
    "src/config.ts",
    "src/index.tsx",
    "src/reportWebVitals.ts",
    "src/setupProxy.js"
  ],
  coverageReporters: sharedJestConfig.coverageReporters,
  coverageThreshold: sharedJestConfig.coverageThreshold,
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['./setupTest.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
};
export default config;