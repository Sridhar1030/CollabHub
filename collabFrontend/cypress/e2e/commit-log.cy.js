/// <reference types="cypress" />

/**
 * E2E Tests for Commit Log Component
 * Tests commit history display, commit diff expansion, and formatting
 */
describe("Commit Log (Commits Tab)", () => {
    beforeEach(() => {
        cy.visitWithMocks();
        cy.wait("@getRepositories");

        // Select a repository
        cy.contains("button", "test-repo").click();
        cy.wait("@getLogs");
        cy.wait("@getCodebase");

        // Switch to Commits tab
        cy.contains("button", "Commits").click();
    });

    describe("Commit List Display", () => {
        it("should display Commit History header", () => {
            cy.contains("Commit History").should("be.visible");
        });

        it("should display commit count", () => {
            cy.contains("3 commits").should("be.visible");
        });

        it("should display individual commits", () => {
            cy.contains("Initial commit").should("be.visible");
            cy.contains("Add new feature").should("be.visible");
            cy.contains("Fix bug in login").should("be.visible");
        });

        it("should display commit author information", () => {
            cy.contains("John Doe").should("be.visible");
            cy.contains("Jane Smith").should("be.visible");
            cy.contains("Bob Wilson").should("be.visible");
        });

        it("should display commit hash (truncated)", () => {
            cy.contains("abc123").should("be.visible");
        });
    });

    describe("Commit Expansion", () => {
        it("should expand commit to show diff when clicked", () => {
            cy.contains("Initial commit")
                .closest('[class*="cursor-pointer"]')
                .click();

            cy.wait("@getCommitDiff");

            // Diff content should be visible
            cy.contains("diff --git").should("be.visible");
        });

        it("should collapse commit when clicked again", () => {
            cy.contains("Initial commit")
                .closest('[class*="cursor-pointer"]')
                .click();

            cy.wait("@getCommitDiff");
            cy.contains("diff --git").should("be.visible");

            cy.contains("Initial commit")
                .closest('[class*="cursor-pointer"]')
                .click();

            cy.contains("diff --git").should("not.exist");
        });

        it("should show loading state while fetching diff", () => {
            cy.intercept("GET", "**/commit-diff/**", {
                delay: 500,
                statusCode: 200,
                body: "diff content",
            }).as("delayedDiff");

            cy.contains("Initial commit")
                .closest('[class*="cursor-pointer"]')
                .click();

            // Loading indicator should appear
            cy.get(".animate-spin").should("exist");
        });
    });

    describe("Diff Display", () => {
        it("should show additions in green/highlighted", () => {
            cy.contains("Initial commit")
                .closest('[class*="cursor-pointer"]')
                .click();

            cy.wait("@getCommitDiff");

            // Lines starting with + should have addition styling
            cy.get('[class*="addition"], [class*="bg-green"]').should("exist");
        });

        it("should show deletions in red/highlighted", () => {
            cy.contains("Initial commit")
                .closest('[class*="cursor-pointer"]')
                .click();

            cy.wait("@getCommitDiff");

            // Lines starting with - should have deletion styling
            cy.get('[class*="deletion"], [class*="bg-red"]').should("exist");
        });
    });

    describe("Commit Author Avatar", () => {
        it("should display author avatars", () => {
            cy.get('[class*="rounded-full"]').should(
                "have.length.greaterThan",
                0,
            );
        });
    });

    describe("Empty Commits", () => {
        it("should show empty state when no commits", () => {
            cy.intercept("GET", "**/log/**", {
                statusCode: 200,
                body: "",
            }).as("emptyLogs");

            cy.visit("/");
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();
            cy.wait("@emptyLogs");

            cy.contains("button", "Commits").click();

            cy.contains("No Commits Found").should("be.visible");
        });
    });

    describe("Commit Info Display", () => {
        it("should show click instruction", () => {
            cy.contains("Click commits to view changes").should("be.visible");
        });
    });

    describe("Scrollable Container", () => {
        it("should have scrollable commits container", () => {
            cy.get('[class*="max-h-"][class*="overflow-y-auto"]').should(
                "exist",
            );
        });
    });

    describe("Relative Time Display", () => {
        it("should display relative timestamps", () => {
            // Check that time-related text exists
            cy.get('[class*="text-gray-400"]').should("exist");
        });
    });
});
