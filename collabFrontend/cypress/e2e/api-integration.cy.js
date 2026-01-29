/// <reference types="cypress" />

/**
 * E2E Tests for API Integration
 * Tests actual API request/response patterns
 */
describe("API Integration", () => {
    describe("Repository API", () => {
        it("should call repositories endpoint with correct URL", () => {
            cy.intercept("GET", "**/repositories/**").as("repoCall");
            cy.visit("/");

            cy.wait("@repoCall")
                .its("request.url")
                .should("include", "/repositories/sridhar");
        });

        it("should include API key header", () => {
            cy.intercept("GET", "**/repositories/**").as("repoCall");
            cy.visit("/");

            cy.wait("@repoCall")
                .its("request.headers")
                .should("have.property", "x-api-key", "abc123");
        });
    });

    describe("Logs API", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
        });

        it("should call logs endpoint with correct URL", () => {
            cy.intercept("GET", "**/log/**").as("logCall");
            cy.contains("button", "test-repo").click();

            cy.wait("@logCall")
                .its("request.url")
                .should("include", "/log/sridhar/test-repo");
        });

        it("should include API key in logs request", () => {
            cy.intercept("GET", "**/log/**").as("logCall");
            cy.contains("button", "test-repo").click();

            cy.wait("@logCall")
                .its("request.headers")
                .should("have.property", "x-api-key", "abc123");
        });
    });

    describe("Codebase API", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
        });

        it("should call codebase endpoint with correct URL", () => {
            cy.intercept("GET", "**/codebase/*/*").as("codebaseCall");
            cy.contains("button", "test-repo").click();

            cy.wait("@codebaseCall")
                .its("request.url")
                .should("include", "/codebase/sridhar/test-repo");
        });

        it("should call file content endpoint with file path", () => {
            cy.intercept("GET", "**/codebase/file/**").as("fileCall");
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            cy.contains("src").click();
            cy.contains("index.js").click();

            cy.wait("@fileCall")
                .its("request.url")
                .should(
                    "include",
                    "/codebase/file/sridhar/test-repo/src/index.js",
                );
        });
    });

    describe("Issues API", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");
        });

        it("should call issues endpoint with correct URL", () => {
            cy.intercept("GET", "**/issues/*/*").as("issuesCall");
            cy.contains("button", "Issues").click();

            cy.wait("@issuesCall")
                .its("request.url")
                .should("include", "/issues/sridhar/test-repo");
        });

        it("should call stats endpoint", () => {
            cy.intercept("GET", "**/issues/*/*/stats").as("statsCall");
            cy.contains("button", "Issues").click();

            cy.wait("@statsCall")
                .its("request.url")
                .should("include", "/issues/sridhar/test-repo/stats");
        });


    });

    describe("Commit Diff API", () => {
        beforeEach(() => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");
            cy.contains("button", "Commits").click();
        });

        it("should call commit diff endpoint with commit hash", () => {
            cy.intercept("GET", "**/commit-diff/**").as("diffCall");

            cy.contains("Initial commit")
                .closest('[class*="cursor-pointer"]')
                .click();

            cy.wait("@diffCall")
                .its("request.url")
                .should("include", "/commit-diff/sridhar/test-repo/");
        });

        it("should include API key in diff request", () => {
            cy.intercept("GET", "**/commit-diff/**").as("diffCall");

            cy.contains("Initial commit")
                .closest('[class*="cursor-pointer"]')
                .click();

            cy.wait("@diffCall")
                .its("request.headers")
                .should("have.property", "x-api-key", "abc123");
        });
    });

    describe("Concurrent API Calls", () => {
        it("should handle concurrent log and codebase requests", () => {
            cy.visitWithMocks();
            cy.wait("@getRepositories");

            cy.intercept("GET", "**/log/**").as("logCall");
            cy.intercept("GET", "**/codebase/*/*").as("codebaseCall");

            cy.contains("button", "test-repo").click();

            // Both calls should complete
            cy.wait("@logCall");
            cy.wait("@codebaseCall");
        });
    });

});
