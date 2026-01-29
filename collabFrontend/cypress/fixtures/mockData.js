// Mock data fixtures for E2E tests

export const mockRepositories = [
    "test-repo",
    "sample-project",
    "my-app",
    "frontend-app",
    "backend-api",
];

export const mockCommitLog = `commit abc123def456789
Author: John Doe <john@example.com>
Date:   Mon Jan 27 2025 10:30:00 GMT+0530

    Initial commit

commit def456abc789012
Author: Jane Smith <jane@example.com>
Date:   Tue Jan 28 2025 14:45:00 GMT+0530

    Add new feature

commit ghi789xyz345678
Author: Bob Wilson <bob@example.com>
Date:   Wed Jan 29 2025 09:15:00 GMT+0530

    Fix bug in login`;

export const mockFileTree = {
    src: {
        type: "directory",
        children: {
            "index.js": { type: "file" },
            "App.js": { type: "file" },
            components: {
                type: "directory",
                children: {
                    "Header.jsx": { type: "file" },
                    "Footer.jsx": { type: "file" },
                    "Button.jsx": { type: "file" },
                },
            },
            utils: {
                type: "directory",
                children: {
                    "helpers.js": { type: "file" },
                    "api.js": { type: "file" },
                },
            },
        },
    },
    public: {
        type: "directory",
        children: {
            "index.html": { type: "file" },
            "favicon.ico": { type: "file" },
        },
    },
    "package.json": { type: "file" },
    "README.md": { type: "file" },
    ".gitignore": { type: "file" },
};

export const mockIssues = [
    {
        _id: "1",
        title: "Bug in login form",
        description:
            "Users cannot login with special characters in their password",
        status: "open",
        priority: "high",
        labels: ["bug", "authentication"],
        assignee: "John Doe",
        createdAt: "2025-01-25T10:00:00Z",
        updatedAt: "2025-01-25T10:00:00Z",
    },
    {
        _id: "2",
        title: "Add dark mode support",
        description: "Implement dark mode toggle in the settings",
        status: "in-progress",
        priority: "medium",
        labels: ["enhancement", "ui"],
        assignee: "Jane Smith",
        createdAt: "2025-01-26T10:00:00Z",
        updatedAt: "2025-01-27T10:00:00Z",
    },
    {
        _id: "3",
        title: "Update API documentation",
        description: "Documentation needs to be updated for v2.0 release",
        status: "closed",
        priority: "low",
        labels: ["documentation"],
        assignee: "Bob Wilson",
        createdAt: "2025-01-20T10:00:00Z",
        updatedAt: "2025-01-22T10:00:00Z",
    },
    {
        _id: "4",
        title: "Performance optimization needed",
        description: "The application is slow on mobile devices",
        status: "open",
        priority: "critical",
        labels: ["performance", "mobile"],
        assignee: null,
        createdAt: "2025-01-28T10:00:00Z",
        updatedAt: "2025-01-28T10:00:00Z",
    },
];

export const mockIssueStats = {
    total: 10,
    byStatus: [
        { _id: "open", count: 5 },
        { _id: "in-progress", count: 3 },
        { _id: "closed", count: 2 },
    ],
    byPriority: [
        { _id: "critical", count: 1 },
        { _id: "high", count: 2 },
        { _id: "medium", count: 4 },
        { _id: "low", count: 3 },
    ],
};

export const mockCollaborators = [
    "John Doe <john@example.com>",
    "Jane Smith <jane@example.com>",
    "Bob Wilson <bob@example.com>",
    "Alice Brown <alice@example.com>",
];

export const mockCommitDiff = `diff --git a/src/App.js b/src/App.js
index 1234567..abcdefg 100644
--- a/src/App.js
+++ b/src/App.js
@@ -1,10 +1,15 @@
 import React from 'react';
+import { useState } from 'react';
+import NewComponent from './NewComponent';
 
 function App() {
+  const [count, setCount] = useState(0);
+  
   return (
     <div className="App">
-      <h1>Hello World</h1>
+      <NewComponent />
+      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
     </div>
   );
 }`;

export const mockFileContent = {
    "src/index.js": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    "src/App.js": `import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto py-8">
        <h1>Welcome to CollabHub</h1>
      </main>
      <Footer />
    </div>
  );
}

export default App;`,
    "package.json": `{
  "name": "test-repo",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
};
