const express = require("express");
const request = require("supertest");
const axios = require("axios");
const { getRepositories } = require("../controllers/repositoryController");

// Mock axios
jest.mock("axios");

// Mock constants
jest.mock("../config/constants", () => ({
    EC2_API_URL: "http://mock-api.com",
}));

// Create express app for testing
const app = express();
app.use(express.json());
app.get("/repositories/:username", getRepositories);

describe("Repository Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /repositories/:username", () => {
        const mockRepositories = [
            { name: "repo1", description: "First repo", stars: 10 },
            { name: "repo2", description: "Second repo", stars: 20 },
        ];

        it("should return repositories for a valid username", async () => {
            axios.get.mockResolvedValue({ data: mockRepositories });

            const response = await request(app)
                .get("/repositories/testuser")
                .expect(200);

            expect(response.body).toEqual(mockRepositories);
            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/repositories/testuser",
            );
        });

        it("should return 404 when user is not found", async () => {
            axios.get.mockRejectedValue({
                response: { status: 404 },
            });

            const response = await request(app)
                .get("/repositories/unknownuser")
                .expect(404);

            expect(response.body).toEqual({
                error: "User 'unknownuser' not found.",
            });
        });

        it("should return 500 on server error", async () => {
            axios.get.mockRejectedValue(new Error("Network error"));

            const response = await request(app)
                .get("/repositories/testuser")
                .expect(500);

            expect(response.body).toEqual({ error: "Network error" });
        });

        it("should handle empty repository list", async () => {
            axios.get.mockResolvedValue({ data: [] });

            const response = await request(app)
                .get("/repositories/newuser")
                .expect(200);

            expect(response.body).toEqual([]);
        });

        it("should handle special characters in username", async () => {
            axios.get.mockResolvedValue({ data: mockRepositories });

            const response = await request(app)
                .get("/repositories/user-name_123")
                .expect(200);

            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/repositories/user-name_123",
            );
        });

        it("should handle timeout errors", async () => {
            axios.get.mockRejectedValue({
                message: "timeout of 5000ms exceeded",
                code: "ECONNABORTED",
            });

            const response = await request(app)
                .get("/repositories/testuser")
                .expect(500);

            expect(response.body.error).toContain("timeout");
        });
    });
});
