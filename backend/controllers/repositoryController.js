const { exec } = require("child_process");
const { EC2_USER, EC2_IP, PEM_PATH } = require('../config/constants');

const getRepositories = (req, res) => {
	const { username } = req.params;
	console.log("username in repositories", username);

	const remoteGitDir = `/var/lib/git/${username}`;
	const sshCommand = `ssh -i "${PEM_PATH}" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} "ls -1 ${remoteGitDir} | sed 's/\\.git$//'"`;

	console.log("sshCommand", sshCommand);
	exec(sshCommand, (err, stdout, stderr) => {
		if (err) {
			return res.status(500).json({ error: stderr || err.message });
		}
		const repositories = stdout.split("\n").filter(Boolean);
		res.json(repositories);
	});
};

module.exports = {
	getRepositories
}; 