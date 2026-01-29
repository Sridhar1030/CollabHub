const express = require("express");
const request = require("supertest");
const axios = require("axios");
const { getCommitDiff } = require("../controllers/commitController");
const { authenticateUser } = require("../middleware/auth");

// Mock axios
jest.mock("axios");

// Mock constants
jest.mock("../config/constants", () => ({
    EC2_API_URL: "http://mock-api.com",
    USER_KEYS: {
        testuser: "valid-api-key",
        anotheruser: "another-api-key",
    },
}));

// Create express app for testing
const app = express();
app.use(express.json());
app.get("/commit-diff/:username/:repo/:hash", authenticateUser, getCommitDiff);

describe("Commit Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /commit-diff/:username/:repo/:hash", () => {
        const mockDiff = {
            hash: "abc123def456",
            message: "Fix bug in login",
            author: "testuser",
            date: "2025-01-15",
            files: [
                {
                    filename: "src/login.js",
                    additions: 10,
                    deletions: 5,
                    changes: "+ added line\n- removed line",
                },
            ],
        };

        it("should return commit diff for valid request with authentication", async () => {
            axios.get.mockResolvedValue({ data: mockDiff });

            const response = await request(app)
                .get("/commit-diff/testuser/testrepo/abc123def456")
                .set("x-api-key", "valid-api-key")
                .expect(200);

            expect(response.body).toEqual(mockDiff);
            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/diff/testuser/testrepo/abc123def456",
            );
        });

        it("should return 403 for invalid API key", async () => {
            const response = await request(app)
                .get("/commit-diff/testuser/testrepo/abc123def456")
                .set("x-api-key", "invalid-api-key")
                .expect(403);

            expect(response.body).toEqual({ error: "Unauthorized access" });
            expect(axios.get).not.toHaveBeenCalled();
        });

        it("should return 403 when API key is missing", async () => {
            const response = await request(app)
                .get("/commit-diff/testuser/testrepo/abc123def456")
                .expect(403);

            expect(response.body).toEqual({ error: "Unauthorized access" });
            expect(axios.get).not.toHaveBeenCalled();
        });

        it("should return 403 when API key does not match username", async () => {
            const response = await request(app)
                .get("/commit-diff/testuser/testrepo/abc123def456")
                .set("x-api-key", "another-api-key") // Key for different user
                .expect(403);

            expect(response.body).toEqual({ error: "Unauthorized access" });
        });

        it("should return 500 on server error", async () => {
            axios.get.mockRejectedValue(new Error("Server error"));

            const response = await request(app)
                .get("/commit-diff/testuser/testrepo/abc123def456")
                .set("x-api-key", "valid-api-key")
                .expect(500);

            expect(response.body).toEqual({ error: "Server error" });
        });

        it("should handle different hash formats", async () => {
            axios.get.mockResolvedValue({ data: mockDiff });

            // Short hash
            await request(app)
                .get("/commit-diff/testuser/testrepo/abc123")
                .set("x-api-key", "valid-api-key")
                .expect(200);

            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/diff/testuser/testrepo/abc123",
            );

            // Full SHA hash
            const fullHash = "abc123def456789012345678901234567890abcd";
            await request(app)
                .get(`/commit-diff/testuser/testrepo/${fullHash}`)
                .set("x-api-key", "valid-api-key")
                .expect(200);

            expect(axios.get).toHaveBeenCalledWith(
                `http://mock-api.com/diff/testuser/testrepo/${fullHash}`,
            );
        });

        it("should handle special characters in repository name", async () => {
            axios.get.mockResolvedValue({ data: mockDiff });

            const response = await request(app)
                .get("/commit-diff/testuser/my-awesome_repo.v2/abc123")
                .set("x-api-key", "valid-api-key")
                .expect(200);

            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/diff/testuser/my-awesome_repo.v2/abc123",
            );
        });

        it("should handle network timeout", async () => {
            axios.get.mockRejectedValue({
                message: "timeout exceeded",
                code: "ECONNABORTED",
            });

            const response = await request(app)
                .get("/commit-diff/testuser/testrepo/abc123")
                .set("x-api-key", "valid-api-key")
                .expect(500);

            expect(response.body.error).toContain("timeout");
        });
    });
});
