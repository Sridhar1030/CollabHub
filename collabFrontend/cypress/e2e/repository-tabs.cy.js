/// <reference types="cypress" />

/**
 * E2E Tests for Repository Tabs Component
 * Tests tab switching between Code, Commits, and Issues
 */
describe("Repository Tabs", () => {
    beforeEach(() => {
        cy.visitWithMocks();
        cy.wait("@getRepositories");

        // Select a repository to show tabs
        cy.contains("button", "test-repo").click();
        cy.wait("@getLogs");
        cy.wait("@getCodebase");
    });

    describe("Tab Display", () => {
        it("should display all three tabs", () => {
            cy.contains("button", "Code").should("be.visible");
            cy.contains("button", "Commits").should("be.visible");
            cy.contains("button", "Issues").should("be.visible");
        });

        it("should display icons for each tab", () => {
            cy.get('[class*="border-b"]')
                .find("button")
                .each(($btn) => {
                    cy.wrap($btn).find("svg").should("exist");
                });
        });
    });

    describe("Tab Selection", () => {
        it("should default to Code tab", () => {
            cy.contains("button", "Code").should(
                "have.class",
                "border-blue-500",
            );
        });

        it("should switch to Commits tab when clicked", () => {
            cy.contains("button", "Commits").click();

            cy.contains("button", "Commits").should(
                "have.class",
                "border-blue-500",
            );
            cy.contains("button", "Code").should(
                "not.have.class",
                "border-blue-500",
            );
        });

        it("should switch to Issues tab when clicked", () => {
            cy.contains("button", "Issues").click();
            cy.wait("@getIssues");
            cy.wait("@getIssueStats");

            cy.contains("button", "Issues").should(
                "have.class",
                "border-blue-500",
            );
        });

        it("should update tab content when switching", () => {
            // Check Code tab content
            cy.get(".glass-dark").should("contain", "src");

            // Switch to Commits
            cy.contains("button", "Commits").click();
            cy.contains("Commit History").should("be.visible");

            // Switch to Issues
            cy.contains("button", "Issues").click();
            cy.wait("@getIssues");
            cy.contains("h2", "Issues").should("be.visible");
        });
    });

    describe("Tab Styling", () => {
        it("should have active styling for selected tab", () => {
            cy.contains("button", "Code")
                .should("have.class", "text-white")
                .and("have.class", "border-blue-500");
        });

        it("should have inactive styling for unselected tabs", () => {
            cy.contains("button", "Commits")
                .should("have.class", "text-gray-400")
                .and("have.class", "border-transparent");
        });

        it("should have hover effects on tabs", () => {
            cy.contains("button", "Commits").should(
                "have.class",
                "hover:text-white",
            );
        });
    });

    describe("Tab Icon Colors", () => {
        it("should have blue icon for active tab", () => {
            cy.contains("button", "Code")
                .find("span")
                .first()
                .should("have.class", "text-blue-500");
        });
    });
});
