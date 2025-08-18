const axios = require('axios');
const { EC2_API_URL } = require('../config/constants');

const getLog = async (req, res) => {
    console.log("Received request");
    const { username, repo } = req.params;
    console.log("username and repo", username, repo);

    try {
        const response = await axios.get(`${EC2_API_URL}/log/${username}/${repo}`);
        res.send(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: "Repository not found" });
        }
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getLog
};