const { exec } = require("child_process");
const { EC2_USER, EC2_IP, PEM_PATH } = require('../config/constants');

const getLog = (req, res) => {
	console.log("Received request");
	const { username, repo } = req.params;
	console.log("username and repo", username, repo);

	// Try both with and without .git suffix
	const remoteGitDir = `/var/lib/git/${username}/${repo}`;
	const remoteGitDirWithGit = `${remoteGitDir}.git`;

	const sshCommand = `ssh -i "${PEM_PATH}" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} "if [ -d ${remoteGitDirWithGit} ]; then git --git-dir=${remoteGitDirWithGit} log; elif [ -d ${remoteGitDir} ]; then git --git-dir=${remoteGitDir} log; else echo 'Repository not found'; fi"`;

	exec(sshCommand, (err, stdout, stderr) => {
		if (err) {
			return res.status(500).json({ error: stderr || err.message });
		}
		if (stdout.includes("Repository not found")) {
			return res.status(404).json({ error: "Repository not found" });
		}
		res.send(stdout);
	});
};

module.exports = {
	getLog
}; 