const vscode = require('vscode');
const { exec } = require('child_process');

// --- STATE MANAGEMENT ---
// A variable to keep track of the branch to avoid showing the same notification repeatedly on auto-runs.
let lastKnownBranch = null;
// A map to store the last change details for each file path.
// Key: filePath (string), Value: { userName, branchName, timestamp } (object)
const fileChanges = new Map();

/**
 * This function is called when your extension is activated.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('CollabHub Change Tracker is now active!');

    // --- AUTOMATIC BRANCH DETECTION ---
    if (vscode.workspace.workspaceFolders) {
        showCurrentBranch(true);
    }
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor && vscode.workspace.workspaceFolders) {
                showCurrentBranch(true);
            }
        })
    );

    // --- COMMAND REGISTRATION ---
    // Register the 'showBranch' command
    context.subscriptions.push(
        vscode.commands.registerCommand('collabhub.showBranch', () => {
            showCurrentBranch(false);
        })
    );

    // Register the new 'getChanges' command
    context.subscriptions.push(
        vscode.commands.registerCommand('collabhub.getChanges', () => {
            showTrackedChanges();
        })
    );

    // --- EVENT LISTENER FOR FILE CHANGES ---
    // This is the core of the change tracking logic.
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(async (event) => {
            // Ignore empty changes
            if (event.contentChanges.length === 0) return;

            const filePath = event.document.uri.fsPath;
            try {
                // We need the current user and branch to store with the change
                const { userName, branchName } = await getCurrentGitInfo();
                const changeDetails = {
                    userName,
                    branchName,
                    timestamp: new Date()
                };
                // Store the latest change details for this file
                fileChanges.set(filePath, changeDetails);
                console.log(`Tracked change in ${filePath}`, changeDetails);
            } catch (error) {
                console.error("Could not track file change:", error);
            }
        })
    );
}

/**
 * Gets the current Git branch and username, then displays it in an information message.
 * @param {boolean} isAutomatic - If true, only shows a notification if the branch has changed.
 */
async function showCurrentBranch(isAutomatic = false) {
    try {
        const { userName, branchName, workspaceName } = await getCurrentGitInfo();

        if (branchName && (!isAutomatic || branchName !== lastKnownBranch)) {
            lastKnownBranch = branchName;
            vscode.window.showInformationMessage(`${userName}, you are working on branch: ${branchName} in ${workspaceName} From CollabHub Thanks for using us 😁`);
        }
    } catch (error) {
        if (!isAutomatic) {
            vscode.window.showErrorMessage(error.message);
        }
        lastKnownBranch = null;
        console.log("CollabHub: Could not detect Git branch or user.");
    }
}

/**
 * Displays the list of tracked file changes.
 */
function showTrackedChanges() {
    if (fileChanges.size === 0) {
        vscode.window.showInformationMessage("No file changes have been tracked in this session yet.");
        return;
    }

    let changesMessage = 'Recent Changes Tracked in this Session:\n';
    for (const [filePath, details] of fileChanges.entries()) {
        const relativePath = vscode.workspace.asRelativePath(filePath);
        const timeString = details.timestamp.toLocaleTimeString();
        changesMessage += `\n- ${details.userName} changed ${relativePath} on branch ${details.branchName} at ${timeString}`;
    }

    // Using a modal message for better readability of a list
    vscode.window.showInformationMessage(changesMessage, { modal: true });
}

/**
 * A helper function to get the current Git user, branch, and workspace name.
 * @returns {Promise<{userName: string, branchName: string, workspaceName: string}>}
 */
async function getCurrentGitInfo() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        throw new Error('CollabHub: No project folder is open.');
    }
    const workspacePath = workspaceFolder.uri.fsPath;

    const runGitCommand = (command) => {
        return new Promise((resolve, reject) => {
            exec(command, { cwd: workspacePath }, (error, stdout, stderr) => {
                if (error) {
                    return reject(new Error(`Failed to run: ${command}. Is this a Git repository?`));
                }
                resolve(stdout.trim());
            });
        });
    };

    const branchCommand = 'git rev-parse --abbrev-ref HEAD';
    const userCommand = 'git config user.name';

    const [branchName, userName] = await Promise.all([
        runGitCommand(branchCommand),
        runGitCommand(userCommand)
    ]);

    return { userName, branchName, workspaceName: workspaceFolder.name };
}

function deactivate() {
    lastKnownBranch = null;
    fileChanges.clear();
}

module.exports = {
    activate,
    deactivate
};
