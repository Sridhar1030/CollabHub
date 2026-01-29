const express = require("express");
const request = require("supertest");
const { authenticateUser } = require("../../middleware/auth");

// Mock constants
jest.mock("../../config/constants", () => ({
    USER_KEYS: {
        testuser: "valid-api-key-123",
        anotheruser: "another-api-key-456",
        admin: "admin-secret-key",
    },
}));

// Create express app for testing
const app = express();
app.use(express.json());

// Protected route for testing
app.get("/protected/:username", authenticateUser, (req, res) => {
    res.json({ message: "Access granted", user: req.params.username });
});

describe("Authentication Middleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("authenticateUser", () => {
        it("should allow access with valid API key", async () => {
            const response = await request(app)
                .get("/protected/testuser")
                .set("x-api-key", "valid-api-key-123")
                .expect(200);

            expect(response.body.message).toBe("Access granted");
            expect(response.body.user).toBe("testuser");
        });

        it("should deny access with invalid API key", async () => {
            const response = await request(app)
                .get("/protected/testuser")
                .set("x-api-key", "wrong-api-key")
                .expect(403);

            expect(response.body).toEqual({ error: "Unauthorized access" });
        });

        it("should deny access when API key is missing", async () => {
            const response = await request(app)
                .get("/protected/testuser")
                .expect(403);

            expect(response.body).toEqual({ error: "Unauthorized access" });
        });

        it("should deny access when API key belongs to different user", async () => {
            const response = await request(app)
                .get("/protected/testuser")
                .set("x-api-key", "another-api-key-456") // Key for 'anotheruser'
                .expect(403);

            expect(response.body).toEqual({ error: "Unauthorized access" });
        });

        it("should deny access for unknown user", async () => {
            const response = await request(app)
                .get("/protected/unknownuser")
                .set("x-api-key", "some-key")
                .expect(403);

            expect(response.body).toEqual({ error: "Unauthorized access" });
        });

        it("should allow access for different valid users", async () => {
            // Test user 1
            const response1 = await request(app)
                .get("/protected/testuser")
                .set("x-api-key", "valid-api-key-123")
                .expect(200);

            expect(response1.body.user).toBe("testuser");

            // Test user 2
            const response2 = await request(app)
                .get("/protected/anotheruser")
                .set("x-api-key", "another-api-key-456")
                .expect(200);

            expect(response2.body.user).toBe("anotheruser");

            // Test admin
            const response3 = await request(app)
                .get("/protected/admin")
                .set("x-api-key", "admin-secret-key")
                .expect(200);

            expect(response3.body.user).toBe("admin");
        });

        it("should be case-sensitive for API keys", async () => {
            const response = await request(app)
                .get("/protected/testuser")
                .set("x-api-key", "VALID-API-KEY-123") // Uppercase
                .expect(403);

            expect(response.body).toEqual({ error: "Unauthorized access" });
        });

        it("should handle empty API key", async () => {
            const response = await request(app)
                .get("/protected/testuser")
                .set("x-api-key", "")
                .expect(403);

            expect(response.body).toEqual({ error: "Unauthorized access" });
        });

        it("should handle API key with extra whitespace (gets trimmed by HTTP)", async () => {
            // Note: HTTP headers may have whitespace trimmed by the server/client
            // The actual behavior depends on the HTTP library - here it accepts trimmed keys
            const response = await request(app)
                .get("/protected/testuser")
                .set("x-api-key", " valid-api-key-123 ") // With spaces - gets trimmed
                .expect(200);

            expect(response.body.message).toBe("Access granted");
        });

        it("should handle multiple headers correctly", async () => {
            const response = await request(app)
                .get("/protected/testuser")
                .set("x-api-key", "valid-api-key-123")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .expect(200);

            expect(response.body.message).toBe("Access granted");
        });
    });
});
