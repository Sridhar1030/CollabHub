const express = require('express');
const { getLog } = require('../controllers/logController');

const router = express.Router();

// GET /log/:username/:repo
// Note: Authentication commented out in original code
router.get('/:username/:repo', getLog);

module.exports = router; 