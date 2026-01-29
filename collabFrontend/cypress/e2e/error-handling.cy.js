/// <reference types="cypress" />

/**
 * E2E Tests for API Error Handling
 * Tests application behavior when API calls fail
 */
describe("Error Handling", () => {
    describe("Repository Fetch Errors", () => {
        it("should handle repository fetch failure", () => {
            cy.intercept("GET", "**/repositories/**", {
                statusCode: 500,
                body: { error: "Internal server error" },
            }).as("failedRepositories");

            cy.visit("/");
            cy.wait("@failedRepositories");

            // App should still load without crashing
            cy.get(".min-h-screen").should("be.visible");
        });

        it("should handle network timeout", () => {
            cy.intercept("GET", "**/repositories/**", {
                forceNetworkError: true,
            }).as("networkError");

            cy.visit("/");

            // App should handle gracefully
            cy.get(".min-h-screen").should("be.visible");
        });
    });

    describe("Log Fetch Errors", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
        });

        it("should handle log fetch failure", () => {
            cy.intercept("GET", "**/log/**", {
                statusCode: 500,
                body: { error: "Failed to fetch logs" },
            }).as("failedLogs");

            cy.contains("button", "test-repo").click();
            cy.wait("@failedLogs");

            // App should continue to function
            cy.get(".glass-dark").should("exist");
        });

        it("should handle empty logs gracefully", () => {
            cy.intercept("GET", "**/log/**", {
                statusCode: 200,
                body: "",
            }).as("emptyLogs");

            cy.contains("button", "test-repo").click();
            cy.wait("@emptyLogs");
            cy.wait("@getCodebase");

            cy.contains("button", "Commits").click();
            cy.contains("No Commits Found").should("be.visible");
        });
    });

    describe("Codebase Fetch Errors", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
        });

        it("should handle codebase fetch failure", () => {
            cy.intercept("GET", "**/codebase/*/*", {
                statusCode: 404,
                body: { error: "Repository not found" },
            }).as("failedCodebase");

            cy.contains("button", "test-repo").click();
            cy.wait("@failedCodebase");

            cy.contains("Error").should("be.visible");
        });


    });

    describe("File Content Fetch Errors", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");
        });

        it("should handle file content fetch failure", () => {
            cy.intercept("GET", "**/codebase/file/**", {
                statusCode: 404,
                body: { error: "File not found" },
            }).as("failedFileContent");

            cy.contains("src").click();
            cy.contains("index.js").click();
            cy.wait("@failedFileContent");

            cy.contains("Error").should("be.visible");
        });
    });

    describe("Issues Fetch Errors", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");
        });

        it("should handle issues fetch failure", () => {
            cy.intercept("GET", "**/issues/*/*", {
                statusCode: 500,
                body: { error: "Failed to fetch issues" },
            }).as("failedIssues");

            cy.contains("button", "Issues").click();
            cy.wait("@failedIssues");

            // Should handle error gracefully
            cy.get(".glass-dark").should("exist");
        });


    });

    describe("Commit Diff Fetch Errors", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");
            cy.contains("button", "Commits").click();
        });

        it("should handle commit diff fetch failure", () => {
            cy.intercept("GET", "**/commit-diff/**", {
                statusCode: 500,
                body: { error: "Diff not available" },
            }).as("failedDiff");

            cy.contains("Initial commit")
                .closest('[class*="cursor-pointer"]')
                .click();

            cy.wait("@failedDiff");

            cy.contains("Error loading diff").should("be.visible");
        });
    });

    describe("401 Unauthorized Errors", () => {
        it("should handle unauthorized repository access", () => {
            cy.intercept("GET", "**/repositories/**", {
                statusCode: 401,
                body: { error: "Unauthorized" },
            }).as("unauthorizedRepos");

            cy.visit("/");
            cy.wait("@unauthorizedRepos");

            // App should handle auth error
            cy.get(".min-h-screen").should("be.visible");
        });
    });

    describe("Rate Limiting", () => {
        it("should handle 429 rate limit response", () => {
            cy.intercept("GET", "**/repositories/**", {
                statusCode: 429,
                body: { error: "Too many requests" },
            }).as("rateLimited");

            cy.visit("/");
            cy.wait("@rateLimited");

            // App should still be usable
            cy.get(".min-h-screen").should("be.visible");
        });
    });
});
