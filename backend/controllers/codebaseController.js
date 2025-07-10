const { exec } = require("child_process");
const { EC2_USER, EC2_IP, PEM_PATH } = require('../config/constants');

const getCodebase = (req, res) => {
	const { username, repo } = req.params;

	const remoteGitDir = `/var/lib/git/${username}/${repo}.git`;

	// Step 1: List all files in HEAD commit
	const sshListCmd = `ssh -i "${PEM_PATH}" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} "git --git-dir=${remoteGitDir} ls-tree -r --name-only HEAD"`;

	exec(sshListCmd, (err, stdout, stderr) => {
		if (err) {
			return res.status(500).json({ error: stderr || err.message });
		}
		const files = stdout.split("\n").filter(Boolean);

		// Step 2: For demo, fetch content for all files (for large repos, fetch on demand)
		const filePromises = files.map((file) => {
			return new Promise((resolve, reject) => {
				const sshShowCmd = `ssh -i "${PEM_PATH}" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} "git --git-dir=${remoteGitDir} show HEAD:${file.replace(
					/(["$`\\])/g,
					"\\$1"
				)}"`;

				exec(sshShowCmd, (showErr, showStdout, showStderr) => {
					if (showErr) {
						// you can skip errors or reject here
						resolve({
							filename: file,
							content: `Error loading file: ${showStderr}`,
						});
					} else {
						resolve({ filename: file, content: showStdout });
					}
				});
			});
		});

		Promise.all(filePromises).then((fileContents) => {
			res.json(fileContents);
		});
	});
};

module.exports = {
	getCodebase
}; 