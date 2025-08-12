const express = require('express');
const logRoutes = require('./logs');
const repositoryRoutes = require('./repositories');
const codebaseRoutes = require('./codebase');
const commitRoutes = require('./commits');

const router = express.Router();

// Mount all routes
router.use('/log', logRoutes);
router.use('/repositories', repositoryRoutes);
router.use('/codebase', codebaseRoutes);
router.use('/commit-diff', commitRoutes);
router.use("/test",(req,res)=>{
    res.send("testing");
})

module.exports = router; 