const express = require('express');
const router = express.Router();
const { getFileTree } = require('../controllers/codebaseController');
const { getFileContent } = require('../controllers/file.controller');

// Fetch file tree
router.get('/:username/:repo', getFileTree);

// Fetch file content using regex
router.get(/^\/file\/([^\/]+)\/([^\/]+)\/(.+)/, getFileContent);

module.exports = router;
