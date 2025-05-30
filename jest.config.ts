import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.+)': '<rootDir>/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!next-auth|@auth|@panva/hkdf|jose|@auth/prisma-adapter|oauth4webapi/build|@dicebear)'
  ]
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
