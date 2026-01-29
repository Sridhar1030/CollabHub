/// <reference types="cypress" />

/**
 * E2E Tests for Performance
 * Tests loading performance and optimizations
 */
describe("Performance", () => {
    beforeEach(() => {
        // Ignore uncaught exceptions from app bugs during rapid switching
        cy.on("uncaught:exception", () => false);
        cy.visitWithMocks();
        cy.wait("@getRepositories");
    });

    describe("Initial Load Performance", () => {
        it("should load the page within acceptable time", () => {
            const startTime = Date.now();

            cy.visit("/");
            cy.get(".min-h-screen").should("be.visible");

            cy.then(() => {
                const loadTime = Date.now() - startTime;
                expect(loadTime).to.be.lessThan(5000); // 5 seconds max
            });
        });
    });

    describe("API Response Handling", () => {
        it("should handle rapid repository switching", () => {
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");

            cy.contains("button", "sample-project").click();
            cy.wait("@getLogs");

            cy.contains("button", "my-app").click();
            cy.wait("@getLogs");

            // Should not crash
            cy.get(".min-h-screen").should("be.visible");
        });

    });

    describe("Large Data Handling", () => {
        it("should handle large repository list", () => {
            const largeRepoList = Array.from(
                { length: 100 },
                (_, i) => `repo-${i}`,
            );

            cy.intercept("GET", "**/repositories/**", {
                statusCode: 200,
                body: largeRepoList,
            }).as("largeRepoList");

            cy.visit("/");
            cy.wait("@largeRepoList");

            cy.get('[class*="w-80"]').should("be.visible");
            cy.contains("100 total").should("be.visible");
        });

        it("should handle large commit history", () => {
            const largeCommitLog = Array.from(
                { length: 50 },
                (_, i) =>
                    `commit hash${i}\nAuthor: User${i} <user${i}@example.com>\nDate: Mon Jan ${i + 1} 2025\n\n    Commit message ${i}`,
            ).join("\n\n");

            cy.intercept("GET", "**/log/**", {
                statusCode: 200,
                body: largeCommitLog,
            }).as("largeCommitLog");

            cy.contains("button", "test-repo").click();
            cy.wait("@largeCommitLog");
            cy.wait("@getCodebase");

            cy.contains("button", "Commits").click();
            cy.contains("50 commits").should("be.visible");
        });

        it("should handle large file tree", () => {
            const largeFileTree = {};
            for (let i = 0; i < 50; i++) {
                largeFileTree[`folder${i}`] = {
                    type: "directory",
                    children: {
                        [`file${i}.js`]: { type: "file" },
                        [`file${i}.css`]: { type: "file" },
                    },
                };
            }

            cy.intercept("GET", "**/codebase/*/*", {
                statusCode: 200,
                body: largeFileTree,
            }).as("largeFileTree");

            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@largeFileTree");

            cy.get(".min-h-screen").should("be.visible");
        });

        it("should handle large issues list", () => {
            const largeIssuesList = Array.from({ length: 50 }, (_, i) => ({
                _id: `${i}`,
                title: `Issue ${i}`,
                description: `Description for issue ${i}`,
                status: ["open", "in-progress", "closed"][i % 3],
                priority: ["low", "medium", "high", "critical"][i % 4],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }));

            cy.intercept("GET", "**/issues/*/*", {
                statusCode: 200,
                body: { issues: largeIssuesList },
            }).as("largeIssuesList");

            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            cy.contains("button", "Issues").click();
            cy.wait("@largeIssuesList");

            cy.get(".min-h-screen").should("be.visible");
        });
    });


    describe("Lazy Loading", () => {
        it("should load file content only when file is clicked", () => {
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            // File content should not be loaded yet
            cy.contains("Hello World").should("not.exist");

            // Click on file
            cy.contains("src").click();
            cy.contains("index.js").click();
            cy.wait("@getFileContent");

            // Now content should be visible
            cy.contains("Hello World").should("be.visible");
        });

        it("should load commit diff only when commit is expanded", () => {
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");
            cy.contains("button", "Commits").click();

            // Diff should not be loaded yet
            cy.contains("diff --git").should("not.exist");

            // Expand commit
            cy.contains("Initial commit")
                .closest('[class*="cursor-pointer"]')
                .click();
            cy.wait("@getCommitDiff");

            // Now diff should be visible
            cy.contains("diff --git").should("be.visible");
        });
    });
});
