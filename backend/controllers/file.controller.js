const axios = require("axios");
const { EC2_API_URL } = require("../config/constants");

const getFileContent = async (req, res) => {
    const username = req.params[0];
    const repo = req.params[1];
    const filePath = req.params[2];

    console.log("Fetching file content:", username, repo, filePath);

    try {
        const response = await axios.get(`${EC2_API_URL}/file/${username}/${repo}/${filePath}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching file content:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            error: error.response?.data?.error || error.message
        });
    }
};

module.exports = {
	getFileContent,
};
