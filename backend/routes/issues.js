const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');

// Get all issues for a repository
router.get('/:username/:repo', issueController.getIssues);

// Get issue statistics
router.get('/:username/:repo/stats', issueController.getIssueStats);

// Get a single issue by ID
router.get('/issue/:id', issueController.getIssueById);

// Create a new issue
router.post('/:username/:repo', issueController.createIssue);

// Update an issue
router.put('/issue/:id', issueController.updateIssue);

// Add a comment to an issue
router.post('/issue/:id/comment', issueController.addComment);

// Delete an issue
router.delete('/issue/:id', issueController.deleteIssue);

module.exports = router;
