module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.(js|jsx|ts|tsx)'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testRegex: '(/tests/.*|\\.(test|spec))\\.(ts|tsx|js|jsx)$',
  testPathIgnorePatterns: [
    '<rootDir>/tests/types.ts',
    '<rootDir>/tests/helpers/',
    '<rootDir>/tests/.*\\.d\\.ts',
  ],
  setupFiles: ['<rootDir>/tests/helpers/setup.ts'],
};
