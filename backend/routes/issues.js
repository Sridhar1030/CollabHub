const express = require("express");
const router = express.Router();
const issueController = require("../controllers/issueController");
const { cacheMiddleware, invalidateCache } = require("../middleware/cache");

// Cache TTL settings
const CACHE_SHORT = 30 * 1000;   // 30 seconds for frequently changing data
const CACHE_MEDIUM = 60 * 1000;  // 1 minute for semi-static data

// =============================================
// IMPORTANT: Order matters! More specific routes first
// =============================================

// Get a single issue by ID (must come before /:username/:repo)
router.get("/issue/:id", cacheMiddleware(CACHE_SHORT), issueController.getIssueById);

// Update an issue (invalidates cache)
router.put("/issue/:id", invalidateCache(), issueController.updateIssue);

// Add a comment to an issue (invalidates cache)
router.post("/issue/:id/comment", invalidateCache(), issueController.addComment);

// Delete an issue (invalidates cache)
router.delete("/issue/:id", invalidateCache(), issueController.deleteIssue);

// Get issue statistics (must come before /:username/:repo)
router.get("/:username/:repo/stats", cacheMiddleware(CACHE_MEDIUM), issueController.getIssueStats);

// Get all issues for a repository (cached)
router.get("/:username/:repo", cacheMiddleware(CACHE_SHORT), issueController.getIssues);

// Create a new issue (invalidates cache)
router.post("/:username/:repo", invalidateCache(), issueController.createIssue);

module.exports = router;
