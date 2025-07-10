const express = require('express');
const { getCodebase } = require('../controllers/codebaseController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// GET /codebase/:username/:repo
router.get('/:username/:repo', authenticateUser, getCodebase);

module.exports = router; 