const axios = require('axios');
const { EC2_API_URL } = require('../config/constants');

const getFileContent = async (req, res) => {
    // const { username, repo } = req.params;
    const username = req.params[0];
    const repo = req.params[1];
    // console.log(objects(req.params)); // Removed undefined reference
    console.log("inside get file content" + username + " " + repo);
    console.log("req.params:", req.params[0]);
    console.dir(req.params ,  { depth: null, colors: true });
    // The rest of the path is now the filepath
    const filepath = req.params[0];

    try {
        const response = await axios.get(`${EC2_API_URL}/file/${username}/${repo}/${filepath}`);
        console.log(`Content for file '${filepath}' fetched successfully.`);
        res.send(response.data);
    } catch (error) {
        console.error("Error fetching file content:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({ error: error.response?.data?.error || error.message });
    }
};

module.exports = {
    getFileContent
};