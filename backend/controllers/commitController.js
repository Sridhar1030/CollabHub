const { exec } = require("child_process");
const { EC2_USER, EC2_IP, PEM_PATH } = require('../config/constants');

const getCommitDiff = (req, res) => {
	const { username, repo, hash } = req.params;

	const remoteGitDir = `/var/lib/git/${username}/${repo}.git`;

	const sshDiffCmd = `ssh -i "${PEM_PATH}" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} "git --git-dir=${remoteGitDir} show ${hash} --no-color"`;

	exec(sshDiffCmd, (err, stdout, stderr) => {
		if (err) {
			return res.status(500).json({ error: stderr || err.message });
		}
		res.send(stdout);
	});
};

module.exports = {
	getCommitDiff
}; 