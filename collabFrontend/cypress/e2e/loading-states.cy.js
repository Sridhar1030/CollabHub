/// <reference types="cypress" />

/**
 * E2E Tests for Loading States
 * Tests loading indicators across the application
 */
describe("Loading States", () => {
    describe("Initial Page Load", () => {
        it("should show loading when fetching repositories", () => {
            cy.intercept("GET", "**/repositories/**", {
                delay: 1000,
                statusCode: 200,
                body: ["test-repo"],
            }).as("delayedRepos");

            cy.visit("/");

            // Loading should be shown initially
            cy.get(".min-h-screen").should("be.visible");
        });
    });

    describe("Repository Selection Loading", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
        });

        it("should show loading when selecting repository", () => {
            cy.intercept("GET", "**/log/**", {
                delay: 500,
                statusCode: 200,
                body: "commit abc123\nAuthor: Test\nDate: Now\n\n    Message",
            }).as("delayedLogs");

            cy.intercept("GET", "**/codebase/*/*", {
                delay: 500,
                statusCode: 200,
                body: { "test.js": { type: "file" } },
            }).as("delayedCodebase");

            cy.contains("button", "test-repo").click();

            // Should show loading state
            cy.get(".animate-spin, .animate-pulse").should("exist");
        });
    });

    describe("File Content Loading", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");
        });

        it("should show loading when fetching file content", () => {
            cy.intercept("GET", "**/codebase/file/**", {
                delay: 500,
                statusCode: 200,
                body: "// file content",
            }).as("delayedFile");

            cy.contains("src").click();
            cy.contains("index.js").click();

            cy.get(".animate-spin").should("exist");
        });
    });

    describe("Issues Loading", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");
        });

        it("should show loading when fetching issues", () => {
            cy.intercept("GET", "**/issues/*/*", {
                delay: 500,
                statusCode: 200,
                body: { issues: [] },
            }).as("delayedIssues");

            cy.contains("button", "Issues").click();

            cy.contains("Loading issues").should("be.visible");
        });
    });

    describe("Commit Diff Loading", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");
            cy.contains("button", "Commits").click();
        });

        it("should show loading when fetching commit diff", () => {
            cy.intercept("GET", "**/commit-diff/**", {
                delay: 500,
                statusCode: 200,
                body: "diff content",
            }).as("delayedDiff");

            cy.contains("Initial commit")
                .closest('[class*="cursor-pointer"]')
                .click();

            cy.get(".animate-spin").should("exist");
        });
    });

    describe("Loading Animation Styles", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
        });

        it("should have spin animation for loaders", () => {
            cy.intercept("GET", "**/log/**", {
                delay: 1000,
                statusCode: 200,
                body: "",
            }).as("delayedLogs");
            cy.intercept("GET", "**/codebase/*/*", {
                delay: 1000,
                statusCode: 200,
                body: {},
            }).as("delayedCodebase");

            cy.contains("button", "test-repo").click();

            cy.get(".animate-spin").should("have.css", "animation");
        });
    });
});
