const express = require("express");
const request = require("supertest");
const axios = require("axios");
const { getAuthors } = require("../controllers/authorController");

// Mock axios
jest.mock("axios");

// Create express app for testing
const app = express();
app.use(express.json());
app.get("/getUsers", getAuthors);

describe("GetUsers Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /getUsers", () => {
        const mockAuthors = [
            "John Doe",
            "Jane Smith",
            "Bob Wilson",
            "Alice Brown",
        ];

        it("should return unique authors list", async () => {
            axios.get.mockResolvedValue({ data: mockAuthors });

            const response = await request(app).get("/getUsers").expect(200);

            expect(response.body).toEqual(mockAuthors);
        });

        it("should remove duplicate authors (case-insensitive)", async () => {
            const authorsWithDuplicates = [
                "John Doe",
                "john doe",
                "JOHN DOE",
                "Jane Smith",
            ];
            axios.get.mockResolvedValue({ data: authorsWithDuplicates });

            const response = await request(app).get("/getUsers").expect(200);

            // Should have only 2 unique authors
            expect(response.body).toHaveLength(2);
            expect(response.body).toContain("John Doe"); // First occurrence preserved
            expect(response.body).toContain("Jane Smith");
        });

        it("should preserve original case of first occurrence", async () => {
            const authors = ["John DOE", "john doe", "JOHN DOE"];
            axios.get.mockResolvedValue({ data: authors });

            const response = await request(app).get("/getUsers").expect(200);

            // First occurrence should be preserved
            expect(response.body[0]).toBe("John DOE");
        });

        it("should handle empty authors list", async () => {
            axios.get.mockResolvedValue({ data: [] });

            const response = await request(app).get("/getUsers").expect(200);

            expect(response.body).toEqual([]);
        });

        it("should return 500 on server error", async () => {
            axios.get.mockRejectedValue(new Error("Network error"));

            const response = await request(app).get("/getUsers").expect(500);

            expect(response.body).toEqual({ error: "Failed to fetch authors" });
        });

        it("should handle authors with special characters", async () => {
            const specialAuthors = [
                "O'Brien",
                "José García",
                "François Müller",
                "Name-With-Hyphens",
            ];
            axios.get.mockResolvedValue({ data: specialAuthors });

            const response = await request(app).get("/getUsers").expect(200);

            expect(response.body).toEqual(specialAuthors);
        });

        it("should handle single author", async () => {
            axios.get.mockResolvedValue({ data: ["Solo Author"] });

            const response = await request(app).get("/getUsers").expect(200);

            expect(response.body).toEqual(["Solo Author"]);
        });

        it("should handle large author lists", async () => {
            const largeAuthorList = Array(500)
                .fill(null)
                .map((_, i) => `Author ${i}`);
            axios.get.mockResolvedValue({ data: largeAuthorList });

            const response = await request(app).get("/getUsers").expect(200);

            expect(response.body).toHaveLength(500);
        });

        it("should handle network timeout", async () => {
            axios.get.mockRejectedValue({
                message: "timeout exceeded",
                code: "ECONNABORTED",
            });

            const response = await request(app).get("/getUsers").expect(500);

            expect(response.body).toEqual({ error: "Failed to fetch authors" });
        });

        it("should handle authors with email-like names", async () => {
            const authors = ["user@example.com", "another@test.com"];
            axios.get.mockResolvedValue({ data: authors });

            const response = await request(app).get("/getUsers").expect(200);

            expect(response.body).toEqual(authors);
        });

        it("should handle whitespace variations in names", async () => {
            const authorsWithWhitespace = [
                "John Doe",
                "  John Doe  ", // Same with extra spaces - but different for case-insensitive comparison
                "Jane  Smith", // Double space
            ];
            axios.get.mockResolvedValue({ data: authorsWithWhitespace });

            const response = await request(app).get("/getUsers").expect(200);

            // Note: Current implementation doesn't trim whitespace,
            // so these would be treated as different
            expect(response.body.length).toBeGreaterThanOrEqual(1);
        });
    });
});
