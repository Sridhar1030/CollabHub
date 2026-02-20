const axios = require('axios');
const { EC2_API_URL } = require('../config/constants'); // e.g., http://13.200.241.196:3000

const getRepositories = async (req, res) => {
    const { username } = req.params;
    console.log("Fetching repositories for username:", username);

    try {
        // Call the new EC2 API endpoint with the username
		const url = `${EC2_API_URL}/repositories/${username}`
		console.log(url)
        const response = await axios.get(url, { timeout: 10000 }); // 10 second timeout
		console.log("Repositories response:", response.data)
        res.json(response.data);
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error("Request timeout for user:", username);
            return res.status(504).json({ error: `Request timeout fetching repositories for ${username}` });
        }
        if (error.response && error.response.status === 404) {
			console.error("User not found:", username);
            return res.status(404).json({ error: `User '${username}' not found.` });
        }
		console.error("Error fetching repositories:", error.message)
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRepositories
};