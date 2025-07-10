const { USER_KEYS } = require('../config/constants');

const authenticateUser = (req, res, next) => {
	const { username } = req.params;
	const apiKey = req.headers["x-api-key"];

	if (USER_KEYS[username] !== apiKey) {
		return res.status(403).json({ error: "Unauthorized access" });
	}

	next();
};

module.exports = {
	authenticateUser
}; 