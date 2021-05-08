module.exports = {
  verbose: true,
  testTimeout: 60000,
  maxConcurrency: 1,
  // "timers": "fake",
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  reporters: ['default', 'jest-junit'],
  coveragePathIgnorePatterns: ['src/migrations', 'node_modules/'],
};
