const axios = require('axios');
const { EC2_API_URL } = require('../config/constants');

const getFileTree = async (req, res) => {
	console.log("inside get file tree")
    const { username, repo } = req.params;

    try {
		console.log("calling tree")
        const response = await axios.get(`${EC2_API_URL}/tree/${username}/${repo}`);
        console.log("File tree fetched successfully.");
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching file tree:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({ error: error.response?.data?.error || error.message });
    }
};

module.exports = {
    getFileTree
};