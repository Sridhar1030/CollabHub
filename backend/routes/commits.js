const express = require('express');
const { getCommitDiff } = require('../controllers/commitController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// GET /commit-diff/:username/:repo/:hash
router.get('/:username/:repo/:hash', authenticateUser, getCommitDiff);

module.exports = router; 