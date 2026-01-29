const express = require("express");
const request = require("supertest");
const axios = require("axios");

// Mock axios for all external calls
jest.mock("axios");

// Mock constants
jest.mock("../../config/constants", () => ({
    EC2_API_URL: "http://mock-api.com",
    USER_KEYS: {
        testuser: "test-api-key",
        admin: "admin-api-key",
    },
}));

// Mock mongoose and Issue model
jest.mock("mongoose", () => ({
    connect: jest.fn().mockResolvedValue({}),
    connection: {
        readyState: 1,
        close: jest.fn(),
    },
}));

jest.mock("../../models/Issue", () => ({
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    aggregate: jest.fn(),
}));

// Import routes
const mainRouter = require("../../routes/index");
const { cacheService } = require("../../middleware/cache");

// Create test app
const app = express();
app.use(express.json());
app.use("/api", mainRouter);

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

describe("Integration Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Clear cache between tests to ensure mock data is used
        cacheService.clear();
    });

    describe("Full API Flow Tests", () => {
        it("should handle complete repository workflow", async () => {
            // 1. Get repositories
            axios.get.mockResolvedValueOnce({ data: [{ name: "testrepo" }] });

            const reposResponse = await request(app)
                .get("/api/repositories/testuser")
                .expect(200);

            expect(reposResponse.body).toHaveLength(1);

            // 2. Get file tree
            axios.get.mockResolvedValueOnce({
                data: {
                    name: "root",
                    children: [{ name: "src", type: "directory" }],
                },
            });

            const treeResponse = await request(app)
                .get("/api/codebase/testuser/testrepo")
                .expect(200);

            expect(treeResponse.body.children).toBeDefined();

            // 3. Get commit log
            axios.get.mockResolvedValueOnce({
                data: [{ hash: "abc123", message: "Initial commit" }],
            });

            const logResponse = await request(app)
                .get("/api/log/testuser/testrepo")
                .expect(200);

            expect(logResponse.body).toHaveLength(1);
        });

        it("should handle error scenarios gracefully", async () => {
            // External API down
            axios.get.mockRejectedValue(new Error("Service unavailable"));

            const response = await request(app)
                .get("/api/repositories/testuser")
                .expect(500);

            expect(response.body.error).toBeDefined();
        });
    });

    describe("Cross-Route Consistency", () => {
        it("should maintain consistent error format across routes", async () => {
            axios.get.mockRejectedValue({ response: { status: 404 } });

            // Test repositories 404
            const repoResponse = await request(app)
                .get("/api/repositories/unknownuser")
                .expect(404);

            expect(repoResponse.body.error).toBeDefined();

            // Test log 404
            axios.get.mockRejectedValue({ response: { status: 404 } });

            const logResponse = await request(app)
                .get("/api/log/testuser/unknownrepo")
                .expect(404);

            expect(logResponse.body.error).toBeDefined();
        });
    });

    describe("Concurrent Requests", () => {
        it("should handle multiple concurrent requests", async () => {
            axios.get.mockResolvedValue({ data: { success: true } });

            const requests = Array(10)
                .fill(null)
                .map(() => request(app).get("/api/repositories/testuser"));

            const responses = await Promise.all(requests);

            responses.forEach((response) => {
                expect(response.status).toBe(200);
            });
        });
    });

    describe("Request/Response Headers", () => {
        it("should accept JSON content type", async () => {
            axios.get.mockResolvedValue({ data: [] });

            await request(app)
                .get("/api/repositories/testuser")
                .set("Content-Type", "application/json")
                .expect(200);
        });

        it("should return JSON response", async () => {
            axios.get.mockResolvedValue({ data: [] });

            const response = await request(app)
                .get("/api/repositories/testuser")
                .expect(200);

            expect(response.headers["content-type"]).toMatch(/json/);
        });
    });

    describe("Test Route", () => {
        it("should respond to test endpoint", async () => {
            const response = await request(app).get("/api/test").expect(200);

            expect(response.text).toBe("testing");
        });
    });
});
