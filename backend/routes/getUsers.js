const express = require('express');
const { getAuthors } = require('../controllers/authorController');

const router = express.Router();

// GET /users - Get unique authors (public endpoint)
router.get('/', getAuthors);

module.exports = router;