const express = require("express");
const router = express.Router();
const issueController = require("../controllers/issueController");

// =============================================
// IMPORTANT: Order matters! More specific routes first
// =============================================

// Get a single issue by ID (must come before /:username/:repo)
router.get("/issue/:id", issueController.getIssueById);

// Update an issue
router.put("/issue/:id", issueController.updateIssue);

// Add a comment to an issue
router.post("/issue/:id/comment", issueController.addComment);

// Delete an issue
router.delete("/issue/:id", issueController.deleteIssue);

// Get issue statistics (must come before /:username/:repo)
router.get("/:username/:repo/stats", issueController.getIssueStats);

// Get all issues for a repository
router.get("/:username/:repo", issueController.getIssues);

// Create a new issue
router.post("/:username/:repo", issueController.createIssue);

module.exports = router;
