# CollabHub Conflict Detection - VS Code Extension

A powerful VS Code extension that provides real-time Git collaboration features, conflict detection, and seamless integration with the CollabHub platform. Enhance your development workflow with live file change tracking and branch monitoring.

## 🌟 Features

### Real-time File Change Tracking
- **Automatic Detection**: Monitors file changes as you type
- **User Attribution**: Tracks which user made which changes
- **Branch Awareness**: Associates changes with current Git branch
- **Timestamp Logging**: Records when changes were made

### Git Integration
- **Branch Monitoring**: Tracks branch switches and updates
- **Git User Detection**: Automatically identifies Git user from configuration
- **Workspace Awareness**: Works with any Git repository workspace

### Command Palette Integration
- **Show Current Branch**: Display current Git branch information
- **Show Recent Changes**: View tracked file changes in current session
- **Quick Access**: All features accessible via VS Code Command Palette

## 🚀 Getting Started

### Installation

#### From Source (Development)
1. Clone the CollabHub repository
2. Navigate to the extension directory:
   ```bash
   cd extension/collabhub-conflict-detection
   npm install
   ```
3. Open the extension folder in VS Code
4. Press `F5` to launch the Extension Development Host
5. Test the extension in the new VS Code window

#### Package Installation
```bash
# Package the extension
npm install -g vsce
vsce package

# Install the .vsix file
code --install-extension collabhub-conflict-detection-0.0.1.vsix
```

### Requirements
- **VS Code**: Version 1.85.0 or higher
- **Git**: Properly configured Git installation
- **Node.js**: For development and building
- **Git Repository**: Active Git repository workspace

## 🔧 Extension Settings

Currently, the extension works automatically without additional configuration. Future versions may include:

* `collabhub.enableAutoTracking`: Enable/disable automatic file change tracking
* `collabhub.serverUrl`: CollabHub server URL for real-time sync
* `collabhub.trackingInterval`: Interval for checking file changes (in milliseconds)

## 📋 Available Commands

Access these commands via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

### `CollabHub: Show Current Branch`
Displays information about the current Git branch including:
- Branch name
- Current Git user
- Workspace name

### `CollabHub: Show Recent Changes`
Shows a detailed list of file changes tracked in the current session:
- File paths (relative to workspace)
- User who made changes
- Branch where changes occurred
- Timestamp of changes

## 🏗️ Architecture

### Extension Structure
```
extension/collabhub-conflict-detection/
├── extension.js              # Main extension logic
├── package.json             # Extension manifest and configuration
├── test/                    # Extension tests
├── .vscode/                 # VS Code configuration
├── README.md               # Documentation
└── CHANGELOG.md            # Version history
```

### Core Components

#### File Change Tracking
```javascript
// Tracks changes with metadata
const fileChanges = new Map();

const trackFileChange = (document) => {
  const filePath = document.fileName;
  const changeInfo = {
    userName: getCurrentGitUser(),
    branchName: getCurrentBranch(),
    timestamp: new Date(),
    workspaceName: getWorkspaceName()
  };
  
  fileChanges.set(filePath, changeInfo);
};
```

#### Git Integration
```javascript
// Executes Git commands safely
const executeGitCommand = (command, cwd) => {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Git command failed: ${error.message}`));
        return;
      }
      resolve(stdout.trim());
    });
  });
};
```

## 🛠️ Development

### Development Setup
```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run tests
npm test

# Package extension
vsce package
```

### Development Scripts
```json
{
  "scripts": {
    "lint": "eslint .",
    "pretest": "npm run lint",
    "test": "vscode-test"
  }
}
```

### Testing the Extension
1. **Manual Testing**:
   - Press `F5` in VS Code to launch Extension Development Host
   - Open a Git repository in the new window
   - Test commands via Command Palette
   - Make file changes and verify tracking

2. **Automated Testing**:
   ```bash
   npm test
   ```

### Extension Events
The extension responds to these VS Code events:
- `onDidChangeTextDocument`: File content changes
- `onDidSaveTextDocument`: File save events
- `onDidChangeWorkspaceFolders`: Workspace changes

## 🔍 How It Works

### Activation
The extension activates when VS Code starts (`onStartupFinished`):
```javascript
function activate(context) {
  // Register commands
  const showBranchCommand = vscode.commands.registerCommand(
    'collabhub.showBranch',
    showCurrentBranch
  );
  
  // Set up file change listeners
  const changeListener = vscode.workspace.onDidChangeTextDocument(
    handleFileChange
  );
  
  context.subscriptions.push(showBranchCommand, changeListener);
}
```

### File Change Detection
```javascript
const handleFileChange = async (event) => {
  try {
    const document = event.document;
    
    // Skip unsaved or non-file documents
    if (document.isUntitled || document.uri.scheme !== 'file') {
      return;
    }
    
    // Get Git information
    const gitInfo = await getCurrentGitInfo();
    
    // Track the change
    trackFileChange(document, gitInfo);
    
  } catch (error) {
    console.error('Error tracking file change:', error);
  }
};
```

### Git Information Retrieval
```javascript
const getCurrentGitInfo = async () => {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    throw new Error('No project folder is open');
  }
  
  const workspacePath = workspaceFolder.uri.fsPath;
  
  const [branchName, userName] = await Promise.all([
    executeGitCommand('git rev-parse --abbrev-ref HEAD', workspacePath),
    executeGitCommand('git config user.name', workspacePath)
  ]);
  
  return {
    userName,
    branchName,
    workspaceName: workspaceFolder.name
  };
};
```

## 🚀 Future Enhancements

### Planned Features
- **Real-time Synchronization**: Connect to CollabHub server for live updates
- **Conflict Visualization**: Highlight conflicting changes in editor
- **Team Awareness**: Show which team members are editing which files
- **Branch Comparison**: Visual diff between branches
- **Merge Conflict Resolution**: Guided conflict resolution tools

### WebSocket Integration (Planned)
```javascript
// Future implementation
const connectToCollabHub = () => {
  const ws = new WebSocket('ws://localhost:5000');
  
  ws.on('open', () => {
    console.log('Connected to CollabHub server');
  });
  
  ws.on('message', (data) => {
    const update = JSON.parse(data);
    handleRealtimeUpdate(update);
  });
};
```

## 📊 Performance Considerations

### Optimization Strategies
- **Debounced Change Detection**: Prevents excessive API calls
- **Selective Tracking**: Only tracks files in Git repositories
- **Memory Management**: Clears old change records automatically
- **Error Boundaries**: Graceful handling of Git command failures

### Resource Usage
- **CPU**: Minimal impact with debounced file monitoring
- **Memory**: Lightweight change tracking with automatic cleanup
- **Network**: No network usage in current version

## 🐛 Known Issues

### Current Limitations
1. **No Persistent Storage**: Changes are tracked only during current session
2. **Single Repository**: Works with one repository per workspace
3. **Basic Git Integration**: Limited to basic Git commands
4. **No Conflict Detection**: Visual conflict highlighting not yet implemented

### Workarounds
- Restart VS Code to clear tracked changes
- Ensure Git is properly configured in your system PATH
- Use separate VS Code windows for different repositories

## 🔧 Troubleshooting

### Common Issues

#### Extension Not Activating
```bash
# Check VS Code version
code --version

# Verify extension is installed
code --list-extensions | grep collabhub
```

#### Git Commands Failing
```bash
# Verify Git installation
git --version

# Check Git configuration
git config --list

# Ensure workspace is a Git repository
git status
```

#### Command Palette Commands Missing
1. Restart VS Code
2. Check Command Palette with "CollabHub"
3. Verify extension is enabled in Extensions view

### Debug Mode
Enable debug logging by opening VS Code Developer Tools:
1. `Help` → `Toggle Developer Tools`
2. Check Console for extension logs
3. Look for "CollabHub" prefixed messages

## 📚 API Reference

### Command Contributions
```json
{
  "contributes": {
    "commands": [
      {
        "command": "collabhub.showBranch",
        "title": "CollabHub: Show Current Branch",
        "category": "CollabHub"
      },
      {
        "command": "collabhub.getChanges",
        "title": "CollabHub: Show Recent Changes",
        "category": "CollabHub"
      }
    ]
  }
}
```

### Extension API
```javascript
// Main activation function
function activate(context: vscode.ExtensionContext): void

// Deactivation cleanup
function deactivate(): void

// Utility functions
async function getCurrentGitInfo(): Promise<GitInfo>
function trackFileChange(document: vscode.TextDocument): void
function showTrackedChanges(): void
```

## 🤝 Contributing

### Development Guidelines
1. Follow VS Code extension best practices
2. Use TypeScript for new features (migration planned)
3. Add tests for new functionality
4. Update documentation for changes
5. Follow conventional commit messages

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Update documentation
5. Submit pull request

## 📄 License

This extension is part of the CollabHub project and follows the same license terms.

## 🔗 Related Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Git Documentation](https://git-scm.com/doc)
- [CollabHub Main Repository](https://github.com/Sridhar1030/CollabHub)
- [VS Code Extension Guidelines](https://code.visualstudio.com/api/ux-guidelines/overview)

---

**Enjoy collaborating with CollabHub!** 🚀
