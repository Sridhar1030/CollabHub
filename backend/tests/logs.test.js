const express = require("express");
const request = require("supertest");
const axios = require("axios");
const { getLog } = require("../controllers/logController");

// Mock axios
jest.mock("axios");

// Mock constants
jest.mock("../config/constants", () => ({
    EC2_API_URL: "http://mock-api.com",
}));

// Create express app for testing
const app = express();
app.use(express.json());
app.get("/log/:username/:repo", getLog);

describe("Log Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /log/:username/:repo", () => {
        const mockCommitLog = [
            {
                hash: "abc123",
                message: "Initial commit",
                author: "testuser",
                date: "2025-01-15T10:00:00Z",
                email: "testuser@example.com",
            },
            {
                hash: "def456",
                message: "Add feature X",
                author: "testuser",
                date: "2025-01-16T14:30:00Z",
                email: "testuser@example.com",
            },
            {
                hash: "ghi789",
                message: "Fix bug in feature X",
                author: "contributor",
                date: "2025-01-17T09:15:00Z",
                email: "contributor@example.com",
            },
        ];

        it("should return commit log for valid repository", async () => {
            axios.get.mockResolvedValue({ data: mockCommitLog });

            const response = await request(app)
                .get("/log/testuser/testrepo")
                .expect(200);

            expect(response.body).toEqual(mockCommitLog);
            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/log/testuser/testrepo",
            );
        });

        it("should return 404 when repository not found", async () => {
            axios.get.mockRejectedValue({
                response: { status: 404 },
            });

            const response = await request(app)
                .get("/log/testuser/nonexistent")
                .expect(404);

            expect(response.body).toEqual({ error: "Repository not found" });
        });

        it("should return 500 on server error", async () => {
            axios.get.mockRejectedValue(new Error("Server error"));

            const response = await request(app)
                .get("/log/testuser/testrepo")
                .expect(500);

            expect(response.body).toEqual({ error: "Server error" });
        });

        it("should handle empty commit history", async () => {
            axios.get.mockResolvedValue({ data: [] });

            const response = await request(app)
                .get("/log/testuser/newrepo")
                .expect(200);

            expect(response.body).toEqual([]);
        });

        it("should handle special characters in repository name", async () => {
            axios.get.mockResolvedValue({ data: mockCommitLog });

            await request(app).get("/log/testuser/my-repo_v2.0").expect(200);

            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/log/testuser/my-repo_v2.0",
            );
        });

        it("should handle network timeout", async () => {
            axios.get.mockRejectedValue({
                message: "timeout exceeded",
                code: "ECONNABORTED",
            });

            const response = await request(app)
                .get("/log/testuser/testrepo")
                .expect(500);

            expect(response.body.error).toContain("timeout");
        });

        it("should handle large commit history", async () => {
            const largeLog = Array(1000)
                .fill(null)
                .map((_, i) => ({
                    hash: `hash${i}`,
                    message: `Commit ${i}`,
                    author: "testuser",
                    date: new Date(Date.now() - i * 86400000).toISOString(),
                }));

            axios.get.mockResolvedValue({ data: largeLog });

            const response = await request(app)
                .get("/log/testuser/largerepo")
                .expect(200);

            expect(response.body).toHaveLength(1000);
        });

        it("should handle commits with multi-line messages", async () => {
            const commitWithMultilineMessage = [
                {
                    hash: "abc123",
                    message: "This is line 1\nThis is line 2\nThis is line 3",
                    author: "testuser",
                    date: "2025-01-15T10:00:00Z",
                },
            ];

            axios.get.mockResolvedValue({ data: commitWithMultilineMessage });

            const response = await request(app)
                .get("/log/testuser/testrepo")
                .expect(200);

            expect(response.body[0].message).toContain("\n");
        });

        it("should handle commits from multiple authors", async () => {
            const multiAuthorLog = [
                {
                    hash: "abc123",
                    message: "Commit 1",
                    author: "user1",
                    date: "2025-01-15",
                },
                {
                    hash: "def456",
                    message: "Commit 2",
                    author: "user2",
                    date: "2025-01-16",
                },
                {
                    hash: "ghi789",
                    message: "Commit 3",
                    author: "user3",
                    date: "2025-01-17",
                },
            ];

            axios.get.mockResolvedValue({ data: multiAuthorLog });

            const response = await request(app)
                .get("/log/testuser/testrepo")
                .expect(200);

            const authors = response.body.map((c) => c.author);
            expect(authors).toContain("user1");
            expect(authors).toContain("user2");
            expect(authors).toContain("user3");
        });
    });
});
