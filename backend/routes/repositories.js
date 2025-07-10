const express = require('express');
const { getRepositories } = require('../controllers/repositoryController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// GET /repositories/:username
router.get('/:username', authenticateUser, getRepositories);

module.exports = router; 