const express = require('express');
const router = express.Router();
const { getFileTree } = require('../controllers/codebaseController');
const { getFileContent } = require('../controllers/file.controller');

// This route should work fine as it does not use a greedy wildcard
router.get('/:username/:repo', getFileTree);

// Use the regular expression for the greedy wildcard path
router.get(/^\/file\/([^\/]+)\/([^\/]+)\/(.*)/, getFileContent);

module.exports = router;