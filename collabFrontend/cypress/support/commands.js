// ***********************************************
// Custom commands for CollabHub E2E tests
// ***********************************************

// Command to intercept and mock API responses
Cypress.Commands.add("mockApi", () => {
    // Mock repositories endpoint
    cy.intercept("GET", "**/repositories/**", {
        statusCode: 200,
        body: ["test-repo", "sample-project", "my-app"],
    }).as("getRepositories");

    // Mock logs endpoint
    cy.intercept("GET", "**/log/**", {
        statusCode: 200,
        body: `commit abc123def456789
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

    Fix bug in login`,
    }).as("getLogs");

    // Mock codebase endpoint
    cy.intercept("GET", "**/codebase/*/*", {
        statusCode: 200,
        body: {
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
                        },
                    },
                },
            },
            "package.json": { type: "file" },
            "README.md": { type: "file" },
        },
    }).as("getCodebase");

    // Mock file content endpoint
    cy.intercept("GET", "**/codebase/file/**", {
        statusCode: 200,
        body: '// Sample file content\nconst app = () => {\n  console.log("Hello World");\n};\n\nexport default app;',
    }).as("getFileContent");

    // Mock issues endpoint
    cy.intercept("GET", "**/issues/*/*", {
        statusCode: 200,
        body: {
            issues: [
                {
                    _id: "1",
                    title: "Bug in login form",
                    description: "Users cannot login with special characters",
                    status: "open",
                    priority: "high",
                    createdAt: "2025-01-25T10:00:00Z",
                    updatedAt: "2025-01-25T10:00:00Z",
                },
                {
                    _id: "2",
                    title: "Add dark mode",
                    description: "Implement dark mode toggle",
                    status: "in-progress",
                    priority: "medium",
                    createdAt: "2025-01-26T10:00:00Z",
                    updatedAt: "2025-01-27T10:00:00Z",
                },
                {
                    _id: "3",
                    title: "Update documentation",
                    description: "Docs need to be updated for v2",
                    status: "closed",
                    priority: "low",
                    createdAt: "2025-01-20T10:00:00Z",
                    updatedAt: "2025-01-22T10:00:00Z",
                },
            ],
        },
    }).as("getIssues");

    // Mock issues stats endpoint
    cy.intercept("GET", "**/issues/*/*/stats", {
        statusCode: 200,
        body: {
            stats: {
                total: 10,
                byStatus: [
                    { _id: "open", count: 5 },
                    { _id: "in-progress", count: 3 },
                    { _id: "closed", count: 2 },
                ],
                byPriority: [
                    { _id: "high", count: 2 },
                    { _id: "medium", count: 5 },
                    { _id: "low", count: 3 },
                ],
            },
        },
    }).as("getIssueStats");

    // Mock commit diff endpoint
    cy.intercept("GET", "**/commit-diff/**", {
        statusCode: 200,
        body: `diff --git a/src/App.js b/src/App.js
--- a/src/App.js
+++ b/src/App.js
@@ -1,5 +1,6 @@
 import React from 'react';
+import NewComponent from './NewComponent';

 function App() {
-  return <div>Hello</div>;
+  return <div><NewComponent /></div>;
 }`,
    }).as("getCommitDiff");

    // Mock create issue endpoint
    cy.intercept("POST", "**/issues/**", {
        statusCode: 201,
        body: {
            issue: {
                _id: "4",
                title: "New Issue",
                description: "New issue description",
                status: "open",
                priority: "medium",
                createdAt: new Date().toISOString(),
            },
        },
    }).as("createIssue");

    // Mock update issue endpoint
    cy.intercept("PATCH", "**/issues/**", {
        statusCode: 200,
        body: { message: "Issue updated successfully" },
    }).as("updateIssue");

    // Mock delete issue endpoint
    cy.intercept("DELETE", "**/issues/**", {
        statusCode: 200,
        body: { message: "Issue deleted successfully" },
    }).as("deleteIssue");

    // Mock collaborators/users endpoint
    cy.intercept("GET", "**/getUsers/**", {
        statusCode: 200,
        body: [
            "John Doe <john@example.com>",
            "Jane Smith <jane@example.com>",
            "Bob Wilson <bob@example.com>",
        ],
    }).as("getCollaborators");
});

// Command to visit the app with mocked API
Cypress.Commands.add("visitWithMocks", () => {
    cy.mockApi();
    cy.visit("/");
});

// Command to select a repository
Cypress.Commands.add("selectRepository", (repoName) => {
    cy.contains("button", repoName).click();
});

// Command to wait for page to load
Cypress.Commands.add("waitForPageLoad", () => {
    cy.get(".min-h-screen").should("be.visible");
});

// Command to switch tabs
Cypress.Commands.add("switchTab", (tabName) => {
    cy.contains("button", tabName).click();
});

// Command to check if loading state is displayed
Cypress.Commands.add("checkLoadingState", () => {
    cy.get(".animate-spin, .animate-pulse").should("exist");
});

// Command to verify repository is selected
Cypress.Commands.add("verifyRepoSelected", (repoName) => {
    cy.contains("button", repoName).should("have.class", "bg-blue-500/20");
});
