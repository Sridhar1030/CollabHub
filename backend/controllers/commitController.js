const axios = require('axios');
const { EC2_API_URL } = require('../config/constants');

const getCommitDiff = async (req, res) => {
    const { username, repo, hash } = req.params;

    try {
        const response = await axios.get(`${EC2_API_URL}/diff/${username}/${repo}/${hash}`);
        res.send(response.data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCommitDiff
};