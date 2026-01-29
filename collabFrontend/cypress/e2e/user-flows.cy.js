/// <reference types="cypress" />

/**
 * E2E Tests for complete user flows
 * Tests realistic user journeys through the application
 */
describe("User Flows", () => {
    beforeEach(() => {
        cy.visitWithMocks();
        cy.wait("@getRepositories");
    });

    describe("Browse Repository Flow", () => {
        it("should complete full repository browsing flow", () => {
            // Step 1: Start at empty state
            cy.contains("Select a Repository").should("be.visible");

            // Step 2: Select repository
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            // Step 3: Verify repository loaded
            cy.contains("Select a Repository").should("not.exist");

            // Step 4: Browse Code tab (default)
            cy.contains("src").should("be.visible");

            // Step 5: Expand directory
            cy.contains("src").click();
            cy.contains("index.js").should("be.visible");

            // Step 6: View file content
            cy.contains("index.js").click();
            cy.wait("@getFileContent");
            cy.contains("Hello World").should("be.visible");

            // Step 7: Switch to Commits tab
            cy.contains("button", "Commits").click();
            cy.contains("Commit History").should("be.visible");

            // Step 8: Expand a commit
            cy.contains("Initial commit")
                .closest('[class*="cursor-pointer"]')
                .click();
            cy.wait("@getCommitDiff");
            cy.contains("diff --git").should("be.visible");

            // Step 9: Switch to Issues tab
            cy.contains("button", "Issues").click();
            cy.wait("@getIssues");
            cy.contains("h2", "Issues").should("be.visible");
        });
    });

    describe("Repository Switching Flow", () => {
        it("should switch between repositories correctly", () => {
            // Select first repository
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");
            cy.contains("button", "test-repo").should(
                "have.class",
                "bg-blue-500/20",
            );

            // Switch to second repository
            cy.contains("button", "sample-project").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            // Verify selection changed
            cy.contains("button", "sample-project").should(
                "have.class",
                "bg-blue-500/20",
            );
            cy.contains("button", "test-repo").should(
                "not.have.class",
                "bg-blue-500/20",
            );
        });
    });

    describe("Issue Management Flow", () => {
        it("should complete issue viewing flow", () => {
            // Select repository
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            // Navigate to Issues
            cy.contains("button", "Issues").click();
            cy.wait("@getIssues");
            cy.wait("@getIssueStats");

            // Verify stats displayed
            cy.contains("Open").should("be.visible");
            cy.contains("5").should("be.visible");

            // Filter by status
            cy.contains("button", "Open").click();
            cy.wait("@getIssues");

            // View issue details
            cy.contains("Bug in login form").click();
        });
    });

    describe("Tab Navigation Flow", () => {
        it("should navigate through all tabs", () => {
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            // Code tab (default)
            cy.contains("button", "Code").should(
                "have.class",
                "border-blue-500",
            );
            cy.contains("src").should("be.visible");

            // Commits tab
            cy.contains("button", "Commits").click();
            cy.contains("button", "Commits").should(
                "have.class",
                "border-blue-500",
            );
            cy.contains("Commit History").should("be.visible");

            // Issues tab
            cy.contains("button", "Issues").click();
            cy.wait("@getIssues");
            cy.contains("button", "Issues").should(
                "have.class",
                "border-blue-500",
            );
            cy.contains("h2", "Issues").should("be.visible");

            // Back to Code tab
            cy.contains("button", "Code").click();
            cy.contains("button", "Code").should(
                "have.class",
                "border-blue-500",
            );
        });
    });

    describe("Search Flow", () => {
        it("should allow searching repositories", () => {
            cy.viewport(1280, 720);

            cy.get('input[placeholder="Search repositories..."]').type("test");

            cy.get('input[placeholder="Search repositories..."]').should(
                "have.value",
                "test",
            );
        });
    });

    describe("Responsive Navigation Flow", () => {
        it("should work on mobile viewport", () => {
            cy.viewport(375, 667);

            // App should still be visible
            cy.get(".min-h-screen").should("be.visible");

            // Sidebar should still be accessible
            cy.contains("Repositories").should("be.visible");

            // Can select repository
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
        });

        it("should work on tablet viewport", () => {
            cy.viewport(768, 1024);

            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            cy.contains("src").should("be.visible");
        });
    });
});
