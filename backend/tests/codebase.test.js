const express = require("express");
const request = require("supertest");
const axios = require("axios");
const { getFileTree } = require("../controllers/codebaseController");
const { getFileContent } = require("../controllers/file.controller");

// Mock axios
jest.mock("axios");

// Mock constants
jest.mock("../config/constants", () => ({
    EC2_API_URL: "http://mock-api.com",
}));

// Create express app for testing
const app = express();
app.use(express.json());
app.get("/codebase/:username/:repo", getFileTree);
app.get(/^\/codebase\/file\/([^\/]+)\/([^\/]+)\/(.+)/, getFileContent);

describe("Codebase Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /codebase/:username/:repo (File Tree)", () => {
        const mockFileTree = {
            name: "root",
            type: "directory",
            children: [
                {
                    name: "src",
                    type: "directory",
                    children: [
                        { name: "index.js", type: "file" },
                        { name: "app.js", type: "file" },
                    ],
                },
                { name: "package.json", type: "file" },
                { name: "README.md", type: "file" },
            ],
        };

        it("should return file tree for valid repository", async () => {
            axios.get.mockResolvedValue({ data: mockFileTree });

            const response = await request(app)
                .get("/codebase/testuser/testrepo")
                .expect(200);

            expect(response.body).toEqual(mockFileTree);
            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/tree/testuser/testrepo",
            );
        });

        it("should return 404 when repository not found", async () => {
            axios.get.mockRejectedValue({
                response: {
                    status: 404,
                    data: { error: "Repository not found" },
                },
            });

            const response = await request(app)
                .get("/codebase/testuser/nonexistent")
                .expect(404);

            expect(response.body.error).toBe("Repository not found");
        });

        it("should return 500 on server error", async () => {
            axios.get.mockRejectedValue(new Error("Server error"));

            const response = await request(app)
                .get("/codebase/testuser/testrepo")
                .expect(500);

            expect(response.body.error).toBe("Server error");
        });

        it("should handle empty repository", async () => {
            axios.get.mockResolvedValue({
                data: { name: "root", type: "directory", children: [] },
            });

            const response = await request(app)
                .get("/codebase/testuser/emptyrepo")
                .expect(200);

            expect(response.body.children).toEqual([]);
        });

        it("should handle special characters in repo name", async () => {
            axios.get.mockResolvedValue({ data: mockFileTree });

            await request(app)
                .get("/codebase/testuser/my-repo_v2.0")
                .expect(200);

            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/tree/testuser/my-repo_v2.0",
            );
        });

        it("should handle network timeout", async () => {
            axios.get.mockRejectedValue({
                message: "timeout exceeded",
                code: "ECONNABORTED",
            });

            const response = await request(app)
                .get("/codebase/testuser/testrepo")
                .expect(500);

            expect(response.body.error).toContain("timeout");
        });
    });

    describe("GET /codebase/file/:username/:repo/:path (File Content)", () => {
        const mockFileContent = {
            content: 'console.log("Hello World");',
            encoding: "utf-8",
            size: 28,
        };

        it("should return file content for valid path", async () => {
            axios.get.mockResolvedValue({ data: mockFileContent });

            const response = await request(app)
                .get("/codebase/file/testuser/testrepo/src/index.js")
                .expect(200);

            expect(response.body).toEqual(mockFileContent);
            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/file/testuser/testrepo/src/index.js",
            );
        });

        it("should handle nested file paths", async () => {
            axios.get.mockResolvedValue({ data: mockFileContent });

            await request(app)
                .get(
                    "/codebase/file/testuser/testrepo/src/components/Header/index.jsx",
                )
                .expect(200);

            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/file/testuser/testrepo/src/components/Header/index.jsx",
            );
        });

        it("should return 404 when file not found", async () => {
            axios.get.mockRejectedValue({
                response: {
                    status: 404,
                    data: { error: "File not found" },
                },
            });

            const response = await request(app)
                .get("/codebase/file/testuser/testrepo/nonexistent.js")
                .expect(404);

            expect(response.body.error).toBe("File not found");
        });

        it("should return 500 on server error", async () => {
            axios.get.mockRejectedValue(new Error("Server error"));

            const response = await request(app)
                .get("/codebase/file/testuser/testrepo/src/index.js")
                .expect(500);

            expect(response.body.error).toBe("Server error");
        });

        it("should handle files with special characters in name", async () => {
            axios.get.mockResolvedValue({ data: mockFileContent });

            await request(app)
                .get(
                    "/codebase/file/testuser/testrepo/src/file-name_v2.test.js",
                )
                .expect(200);

            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/file/testuser/testrepo/src/file-name_v2.test.js",
            );
        });

        it("should handle binary file response", async () => {
            const binaryResponse = {
                content: "base64encodedcontent==",
                encoding: "base64",
                size: 1024,
            };
            axios.get.mockResolvedValue({ data: binaryResponse });

            const response = await request(app)
                .get("/codebase/file/testuser/testrepo/assets/image.png")
                .expect(200);

            expect(response.body.encoding).toBe("base64");
        });

        it("should handle large file paths", async () => {
            axios.get.mockResolvedValue({ data: mockFileContent });

            const longPath =
                "src/components/features/authentication/providers/oauth/google/GoogleOAuthProvider.jsx";
            await request(app)
                .get(`/codebase/file/testuser/testrepo/${longPath}`)
                .expect(200);

            expect(axios.get).toHaveBeenCalledWith(
                `http://mock-api.com/file/testuser/testrepo/${longPath}`,
            );
        });

        it("should handle files in root directory", async () => {
            axios.get.mockResolvedValue({ data: mockFileContent });

            await request(app)
                .get("/codebase/file/testuser/testrepo/README.md")
                .expect(200);

            expect(axios.get).toHaveBeenCalledWith(
                "http://mock-api.com/file/testuser/testrepo/README.md",
            );
        });
    });
});
