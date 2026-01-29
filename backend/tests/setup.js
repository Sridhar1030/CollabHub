// Test setup and configuration
const mongoose = require("mongoose");

// Mock environment variables
process.env.NODE_ENV = "test";

// Increase timeout for async operations
jest.setTimeout(30000);

// Clean up after all tests
afterAll(async () => {
    // Close any open connections
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
});

// Clear all mocks between tests
beforeEach(() => {
    jest.clearAllMocks();
});

module.exports = {};
