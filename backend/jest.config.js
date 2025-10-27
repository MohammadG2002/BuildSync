export default {
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.js", "!src/server.js", "!src/scripts/**"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
  transform: {},
};
