const express = require('express');
const { getRepositories } = require('../controllers/repositoryController');
const { authenticateUser } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');

const router = express.Router();

// Cache repositories for 2 minutes (data doesn't change frequently)
const CACHE_REPOS = 2 * 60 * 1000;

// GET /repositories/:username (cached)
router.get('/:username', cacheMiddleware(CACHE_REPOS), getRepositories);

module.exports = router; 