const express = require("express");
const request = require("supertest");

// Mock all route modules
jest.mock("../routes/logs", () => {
    const router = require("express").Router();
    router.get("/:username/:repo", (req, res) => res.json({ route: "logs" }));
    return router;
});

jest.mock("../routes/repositories", () => {
    const router = require("express").Router();
    router.get("/:username", (req, res) => res.json({ route: "repositories" }));
    return router;
});

jest.mock("../routes/codebase", () => {
    const router = require("express").Router();
    router.get("/:username/:repo", (req, res) =>
        res.json({ route: "codebase" }),
    );
    return router;
});

jest.mock("../routes/commits", () => {
    const router = require("express").Router();
    router.get("/:username/:repo/:hash", (req, res) =>
        res.json({ route: "commits" }),
    );
    return router;
});

jest.mock("../routes/getUsers", () => {
    const router = require("express").Router();
    router.get("/", (req, res) => res.json({ route: "getUsers" }));
    return router;
});

jest.mock("../routes/issues", () => {
    const router = require("express").Router();
    router.get("/:username/:repo", (req, res) => res.json({ route: "issues" }));
    return router;
});

// Import main router after mocks
const mainRouter = require("../routes/index");

// Create express app for testing
const app = express();
app.use(express.json());
app.use("/api", mainRouter);

describe("Main Router (index.js)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Route mounting", () => {
        it("should mount log routes at /api/log", async () => {
            const response = await request(app)
                .get("/api/log/testuser/testrepo")
                .expect(200);

            expect(response.body.route).toBe("logs");
        });

        it("should mount repository routes at /api/repositories", async () => {
            const response = await request(app)
                .get("/api/repositories/testuser")
                .expect(200);

            expect(response.body.route).toBe("repositories");
        });

        it("should mount codebase routes at /api/codebase", async () => {
            const response = await request(app)
                .get("/api/codebase/testuser/testrepo")
                .expect(200);

            expect(response.body.route).toBe("codebase");
        });

        it("should mount commit-diff routes at /api/commit-diff", async () => {
            const response = await request(app)
                .get("/api/commit-diff/testuser/testrepo/abc123")
                .expect(200);

            expect(response.body.route).toBe("commits");
        });

        it("should mount getUsers routes at /api/getUsers", async () => {
            const response = await request(app)
                .get("/api/getUsers")
                .expect(200);

            expect(response.body.route).toBe("getUsers");
        });

        it("should mount issues routes at /api/issues", async () => {
            const response = await request(app)
                .get("/api/issues/testuser/testrepo")
                .expect(200);

            expect(response.body.route).toBe("issues");
        });

        it("should respond to test route", async () => {
            const response = await request(app).get("/api/test").expect(200);

            expect(response.text).toBe("testing");
        });
    });

    describe("404 handling", () => {
        it("should return 404 for unknown routes", async () => {
            await request(app).get("/api/unknown").expect(404);
        });

        it("should return 404 for root path without route", async () => {
            await request(app).get("/api/").expect(404);
        });
    });

    describe("HTTP methods", () => {
        it("should handle GET requests", async () => {
            const response = await request(app).get("/api/test").expect(200);

            expect(response.text).toBe("testing");
        });

        it("should handle POST requests on test route (accepts all methods)", async () => {
            const response = await request(app).post("/api/test").expect(200);
            expect(response.text).toBe("testing");
        });
    });
});
