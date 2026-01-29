const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");
const issueController = require("../controllers/issueController");
const Issue = require("../models/Issue");

// Mock Issue model
jest.mock("../models/Issue");

// Create express app for testing
const app = express();
app.use(express.json());

// Setup routes - IMPORTANT: Order matters! More specific routes first
app.get("/issues/issue/:id", issueController.getIssueById);
app.put("/issues/issue/:id", issueController.updateIssue);
app.post("/issues/issue/:id/comment", issueController.addComment);
app.delete("/issues/issue/:id", issueController.deleteIssue);
app.get("/issues/:username/:repo/stats", issueController.getIssueStats);
app.get("/issues/:username/:repo", issueController.getIssues);
app.post("/issues/:username/:repo", issueController.createIssue);

describe("Issue Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Mock data
    const mockIssue = {
        _id: "507f1f77bcf86cd799439011",
        username: "testuser",
        repository: "testrepo",
        title: "Test Issue",
        description: "Test description",
        status: "open",
        priority: "medium",
        assignees: [{ name: "John", email: "john@test.com" }],
        createdBy: { name: "Jane", email: "jane@test.com" },
        labels: ["bug"],
        comments: [],
        save: jest.fn().mockResolvedValue(true),
    };

    describe("GET /issues/:username/:repo", () => {
        it("should return all issues for a repository", async () => {
            const mockIssues = [
                mockIssue,
                { ...mockIssue, _id: "507f1f77bcf86cd799439012" },
            ];

            Issue.find.mockReturnValue({
                sort: jest.fn().mockResolvedValue(mockIssues),
            });

            const response = await request(app)
                .get("/issues/testuser/testrepo")
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(2);
            expect(response.body.issues).toHaveLength(2);
        });

        it("should filter issues by status", async () => {
            Issue.find.mockReturnValue({
                sort: jest.fn().mockResolvedValue([mockIssue]),
            });

            const response = await request(app)
                .get("/issues/testuser/testrepo?status=open")
                .expect(200);

            expect(Issue.find).toHaveBeenCalledWith(
                expect.objectContaining({ status: "open" }),
            );
        });

        it("should filter issues by priority", async () => {
            Issue.find.mockReturnValue({
                sort: jest.fn().mockResolvedValue([mockIssue]),
            });

            const response = await request(app)
                .get("/issues/testuser/testrepo?priority=high")
                .expect(200);

            expect(Issue.find).toHaveBeenCalledWith(
                expect.objectContaining({ priority: "high" }),
            );
        });

        it("should filter issues by assignee", async () => {
            Issue.find.mockReturnValue({
                sort: jest.fn().mockResolvedValue([mockIssue]),
            });

            const response = await request(app)
                .get("/issues/testuser/testrepo?assignee=john@test.com")
                .expect(200);

            expect(Issue.find).toHaveBeenCalledWith(
                expect.objectContaining({ "assignees.email": "john@test.com" }),
            );
        });

        it("should handle multiple filters", async () => {
            Issue.find.mockReturnValue({
                sort: jest.fn().mockResolvedValue([mockIssue]),
            });

            const response = await request(app)
                .get("/issues/testuser/testrepo?status=open&priority=high")
                .expect(200);

            expect(Issue.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: "open",
                    priority: "high",
                }),
            );
        });

        it("should return empty array when no issues found", async () => {
            Issue.find.mockReturnValue({
                sort: jest.fn().mockResolvedValue([]),
            });

            const response = await request(app)
                .get("/issues/testuser/testrepo")
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(0);
            expect(response.body.issues).toEqual([]);
        });

        it("should return 500 on database error", async () => {
            Issue.find.mockReturnValue({
                sort: jest.fn().mockRejectedValue(new Error("Database error")),
            });

            const response = await request(app)
                .get("/issues/testuser/testrepo")
                .expect(500);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Failed to fetch issues");
        });
    });

    describe("GET /issues/issue/:id", () => {
        it("should return a single issue by ID", async () => {
            Issue.findById.mockResolvedValue(mockIssue);

            const response = await request(app)
                .get("/issues/issue/507f1f77bcf86cd799439011")
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.issue).toBeDefined();
        });

        it("should return 404 when issue not found", async () => {
            Issue.findById.mockResolvedValue(null);

            const response = await request(app)
                .get("/issues/issue/507f1f77bcf86cd799439099")
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Issue not found");
        });

        it("should return 500 on database error", async () => {
            Issue.findById.mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .get("/issues/issue/507f1f77bcf86cd799439011")
                .expect(500);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Failed to fetch issue");
        });

        it("should handle invalid ObjectId format", async () => {
            Issue.findById.mockRejectedValue(
                new Error("Cast to ObjectId failed"),
            );

            const response = await request(app)
                .get("/issues/issue/invalid-id")
                .expect(500);

            expect(response.body.success).toBe(false);
        });
    });

    describe("POST /issues/:username/:repo", () => {
        const validIssueData = {
            title: "New Issue",
            description: "Issue description",
            priority: "high",
            createdBy: { name: "Jane", email: "jane@test.com" },
            assignees: [{ name: "John", email: "john@test.com" }],
            labels: ["feature"],
        };

        it("should create a new issue with all fields", async () => {
            const savedIssue = { ...mockIssue, ...validIssueData };
            Issue.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(savedIssue),
                ...savedIssue,
            }));

            const response = await request(app)
                .post("/issues/testuser/testrepo")
                .send(validIssueData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Issue created successfully");
        });

        it("should create issue with default priority when not provided", async () => {
            const dataWithoutPriority = {
                title: "New Issue",
                description: "Issue description",
                createdBy: { name: "Jane", email: "jane@test.com" },
            };

            Issue.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue({
                    ...mockIssue,
                    ...dataWithoutPriority,
                }),
                ...mockIssue,
                ...dataWithoutPriority,
            }));

            const response = await request(app)
                .post("/issues/testuser/testrepo")
                .send(dataWithoutPriority)
                .expect(201);

            expect(response.body.success).toBe(true);
        });

        it("should return 400 when title is missing", async () => {
            const invalidData = {
                description: "Issue description",
                createdBy: { name: "Jane", email: "jane@test.com" },
            };

            const response = await request(app)
                .post("/issues/testuser/testrepo")
                .send(invalidData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("required");
        });

        it("should return 400 when description is missing", async () => {
            const invalidData = {
                title: "New Issue",
                createdBy: { name: "Jane", email: "jane@test.com" },
            };

            const response = await request(app)
                .post("/issues/testuser/testrepo")
                .send(invalidData)
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it("should return 400 when createdBy is missing", async () => {
            const invalidData = {
                title: "New Issue",
                description: "Issue description",
            };

            const response = await request(app)
                .post("/issues/testuser/testrepo")
                .send(invalidData)
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it("should return 500 on database save error", async () => {
            Issue.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error("Database error")),
            }));

            const response = await request(app)
                .post("/issues/testuser/testrepo")
                .send(validIssueData)
                .expect(500);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Failed to create issue");
        });
    });

    describe("PUT /issues/issue/:id", () => {
        const updateData = {
            title: "Updated Title",
            status: "in-progress",
            priority: "critical",
        };

        it("should update an existing issue", async () => {
            const updatedIssue = { ...mockIssue, ...updateData };
            Issue.findByIdAndUpdate.mockResolvedValue(updatedIssue);

            const response = await request(app)
                .put("/issues/issue/507f1f77bcf86cd799439011")
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Issue updated successfully");
        });

        it("should return 404 when issue not found", async () => {
            Issue.findByIdAndUpdate.mockResolvedValue(null);

            const response = await request(app)
                .put("/issues/issue/507f1f77bcf86cd799439099")
                .send(updateData)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Issue not found");
        });

        it("should ignore _id in update data", async () => {
            const dataWithId = { ...updateData, _id: "malicious-id" };
            Issue.findByIdAndUpdate.mockResolvedValue({
                ...mockIssue,
                ...updateData,
            });

            await request(app)
                .put("/issues/issue/507f1f77bcf86cd799439011")
                .send(dataWithId)
                .expect(200);

            expect(Issue.findByIdAndUpdate).toHaveBeenCalledWith(
                "507f1f77bcf86cd799439011",
                expect.not.objectContaining({ _id: "malicious-id" }),
                expect.any(Object),
            );
        });

        it("should return 500 on database error", async () => {
            Issue.findByIdAndUpdate.mockRejectedValue(
                new Error("Database error"),
            );

            const response = await request(app)
                .put("/issues/issue/507f1f77bcf86cd799439011")
                .send(updateData)
                .expect(500);

            expect(response.body.success).toBe(false);
        });

        it("should update only specific fields", async () => {
            const partialUpdate = { status: "closed" };
            Issue.findByIdAndUpdate.mockResolvedValue({
                ...mockIssue,
                status: "closed",
            });

            const response = await request(app)
                .put("/issues/issue/507f1f77bcf86cd799439011")
                .send(partialUpdate)
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe("POST /issues/issue/:id/comment", () => {
        const commentData = {
            author: { name: "Commenter", email: "commenter@test.com" },
            text: "This is a test comment",
        };

        it("should add a comment to an issue", async () => {
            const issueWithSave = {
                ...mockIssue,
                comments: [],
                save: jest.fn().mockResolvedValue(true),
            };
            issueWithSave.comments.push = jest.fn();
            Issue.findById.mockResolvedValue(issueWithSave);

            const response = await request(app)
                .post("/issues/issue/507f1f77bcf86cd799439011/comment")
                .send(commentData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Comment added successfully");
        });

        it("should return 404 when issue not found", async () => {
            Issue.findById.mockResolvedValue(null);

            const response = await request(app)
                .post("/issues/issue/507f1f77bcf86cd799439099/comment")
                .send(commentData)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Issue not found");
        });

        it("should return 400 when author is missing", async () => {
            const invalidComment = { text: "Comment without author" };

            const response = await request(app)
                .post("/issues/issue/507f1f77bcf86cd799439011/comment")
                .send(invalidComment)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("required");
        });

        it("should return 400 when text is missing", async () => {
            const invalidComment = {
                author: { name: "Test", email: "test@test.com" },
            };

            const response = await request(app)
                .post("/issues/issue/507f1f77bcf86cd799439011/comment")
                .send(invalidComment)
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it("should return 500 on database error", async () => {
            const issueWithSave = {
                ...mockIssue,
                comments: [],
                save: jest.fn().mockRejectedValue(new Error("Database error")),
            };
            issueWithSave.comments.push = jest.fn();
            Issue.findById.mockResolvedValue(issueWithSave);

            const response = await request(app)
                .post("/issues/issue/507f1f77bcf86cd799439011/comment")
                .send(commentData)
                .expect(500);

            expect(response.body.success).toBe(false);
        });
    });

    describe("DELETE /issues/issue/:id", () => {
        it("should delete an existing issue", async () => {
            Issue.findByIdAndDelete.mockResolvedValue(mockIssue);

            const response = await request(app)
                .delete("/issues/issue/507f1f77bcf86cd799439011")
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Issue deleted successfully");
        });

        it("should return 404 when issue not found", async () => {
            Issue.findByIdAndDelete.mockResolvedValue(null);

            const response = await request(app)
                .delete("/issues/issue/507f1f77bcf86cd799439099")
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Issue not found");
        });

        it("should return 500 on database error", async () => {
            Issue.findByIdAndDelete.mockRejectedValue(
                new Error("Database error"),
            );

            const response = await request(app)
                .delete("/issues/issue/507f1f77bcf86cd799439011")
                .expect(500);

            expect(response.body.success).toBe(false);
        });
    });

    describe("GET /issues/:username/:repo/stats", () => {
        const mockStats = [
            { _id: "open", count: 5 },
            { _id: "closed", count: 10 },
        ];
        const mockPriorityStats = [
            { _id: "high", count: 3 },
            { _id: "medium", count: 7 },
        ];

        it("should return issue statistics", async () => {
            Issue.aggregate
                .mockResolvedValueOnce(mockStats)
                .mockResolvedValueOnce(mockPriorityStats);

            const response = await request(app)
                .get("/issues/testuser/testrepo/stats")
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.stats.byStatus).toEqual(mockStats);
            expect(response.body.stats.byPriority).toEqual(mockPriorityStats);
        });

        it("should return empty stats for repository with no issues", async () => {
            Issue.aggregate.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

            const response = await request(app)
                .get("/issues/testuser/emptyrepo/stats")
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.stats.byStatus).toEqual([]);
        });

        it("should return 500 on database error", async () => {
            Issue.aggregate.mockRejectedValue(new Error("Aggregation error"));

            const response = await request(app)
                .get("/issues/testuser/testrepo/stats")
                .expect(500);

            expect(response.body.success).toBe(false);
        });
    });
});
