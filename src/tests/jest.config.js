// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Provide the path to your Next.js app
});

const customJestConfig = {
  testEnvironment: 'node', // For testing API routes
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'], // Optional setup file
  moduleNameMapper: {
    // Handle module aliasing (if you have any)
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
