module.exports = {
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.js"],
    collectCoverageFrom: [
        "controllers/**/*.js",
        "routes/**/*.js",
        "middleware/**/*.js",
        "!**/node_modules/**",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],
    setupFilesAfterEnv: ["./tests/setup.js"],
    testTimeout: 30000,
    verbose: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};
