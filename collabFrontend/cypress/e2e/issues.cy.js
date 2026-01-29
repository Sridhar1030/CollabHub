/// <reference types="cypress" />

/**
 * E2E Tests for Issues Component
 * Tests issue listing, filtering, creation, and management
 */
describe("Issues (Issues Tab)", () => {
    beforeEach(() => {
        cy.visitWithMocks();
        cy.wait("@getRepositories");

        // Select a repository
        cy.contains("button", "test-repo").click();
        cy.wait("@getLogs");
        cy.wait("@getCodebase");

        // Switch to Issues tab
        cy.contains("button", "Issues").click();
        cy.wait("@getIssues");
        cy.wait("@getIssueStats");
    });

    describe("Issues Header", () => {
        it("should display Issues header", () => {
            cy.contains("h2", "Issues").should("be.visible");
        });

        it("should display New Issue button", () => {
            cy.contains("button", "New Issue").should("be.visible");
        });

        it("should display description text", () => {
            cy.contains("Track and manage repository issues").should(
                "be.visible",
            );
        });
    });

    describe("Statistics Cards", () => {
        it("should display Open issues count", () => {
            cy.contains("Open").should("be.visible");
            cy.contains("5").should("be.visible");
        });

        it("should display In Progress issues count", () => {
            cy.contains("In Progress").should("be.visible");
            cy.contains("3").should("be.visible");
        });

        it("should display Closed issues count", () => {
            cy.contains("Closed").should("be.visible");
            cy.contains("2").should("be.visible");
        });

        it("should display Total issues count", () => {
            cy.contains("Total").should("be.visible");
        });
    });

    describe("Filter Tabs", () => {
        it("should display all filter options", () => {
            cy.contains("button", "All").should("be.visible");
            cy.contains("button", "Open").should("be.visible");
            cy.contains("button", "In progress").should("be.visible");
            cy.contains("button", "Closed").should("be.visible");
        });

        it("should default to All filter", () => {
            cy.contains("button", "All").should("have.class", "bg-blue-500");
        });

        it("should filter issues when clicking Open", () => {
            cy.contains("button", "Open").click();

            cy.wait("@getIssues")
                .its("request.url")
                .should("include", "status=open");
        });

        it("should filter issues when clicking In progress", () => {
            cy.contains("button", "In progress").click();

            cy.wait("@getIssues")
                .its("request.url")
                .should("include", "status=in-progress");
        });

        it("should filter issues when clicking Closed", () => {
            cy.contains("button", "Closed").click();

            cy.wait("@getIssues")
                .its("request.url")
                .should("include", "status=closed");
        });

        it("should highlight active filter", () => {
            cy.contains("button", "Open").click();

            cy.contains("button", "Open").should("have.class", "bg-blue-500");
            cy.contains("button", "All").should(
                "not.have.class",
                "bg-blue-500",
            );
        });
    });

    describe("Issues List", () => {
        it("should display issues from API", () => {
            cy.contains("Bug in login form").should("be.visible");
            cy.contains("Add dark mode").should("be.visible");
            cy.contains("Update documentation").should("be.visible");
        });

        it("should display issue status badges", () => {
            cy.contains("open").should("be.visible");
            cy.contains("in-progress").should("be.visible");
            cy.contains("closed").should("be.visible");
        });

        it("should display priority icons", () => {
            cy.contains("🟠").should("be.visible"); // high
            cy.contains("🟡").should("be.visible"); // medium
            cy.contains("🔵").should("be.visible"); // low
        });

        it("should display issue descriptions", () => {
            cy.contains("Users cannot login with special characters").should(
                "be.visible",
            );
        });
    });

    describe("Create Issue Modal", () => {
        it("should open create modal when clicking New Issue", () => {
            cy.contains("button", "New Issue").click();

            // Modal should be visible
            cy.get('[role="dialog"], .fixed.inset-0').should("be.visible");
        });

        it("should have form fields in create modal", () => {
            cy.contains("button", "New Issue").click();

            cy.get('input[placeholder*="title"], input[name="title"]').should(
                "exist",
            );
            cy.get('textarea, [contenteditable="true"]').should("exist");
        });

        it("should close modal when clicking close button", () => {
            cy.contains("button", "New Issue").click();

            // Click close button (usually an X or Cancel)
            cy.get('[class*="fixed"]')
                .find("button")
                .contains(/close|cancel|×/i)
                .click({ force: true });

            // Modal should be hidden
            cy.get('[role="dialog"]').should("not.exist");
        });
    });

    describe("Issue Detail Modal", () => {
        it("should open detail modal when clicking an issue", () => {
            cy.contains("Bug in login form").click();

            // Detail modal should appear
            cy.get('[role="dialog"], .fixed.inset-0').should("be.visible");
        });

        it("should display issue details in modal", () => {
            cy.contains("Bug in login form").click();

            cy.contains("Bug in login form").should("be.visible");
            cy.contains("Users cannot login with special characters").should(
                "be.visible",
            );
        });
    });

    describe("Issue Status Colors", () => {
        it("should show green for open issues", () => {
            cy.contains("open").should("have.class", "text-green-400");
        });

        it("should show yellow for in-progress issues", () => {
            cy.contains("in-progress").should("have.class", "text-yellow-400");
        });

        it("should show gray for closed issues", () => {
            cy.contains("closed").should("have.class", "text-gray-400");
        });
    });

    describe("Empty Issues State", () => {
        it("should show empty state when no issues", () => {
            cy.intercept("GET", "**/issues/*/*", {
                statusCode: 200,
                body: { issues: [] },
            }).as("emptyIssues");

            cy.visit("/");
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");

            cy.contains("button", "Issues").click();
            cy.wait("@emptyIssues");

            cy.contains("No issues found").should("be.visible");
            cy.contains("Create your first issue").should("be.visible");
        });
    });

    describe("Loading State", () => {
        it("should show loading while fetching issues", () => {
            cy.intercept("GET", "**/issues/*/*", {
                delay: 500,
                statusCode: 200,
                body: { issues: [] },
            }).as("delayedIssues");

            cy.visit("/");
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");

            cy.contains("button", "Issues").click();

            cy.contains("Loading issues").should("be.visible");
        });
    });

    describe("Issue Hover Effects", () => {
        it("should highlight issue on hover", () => {
            cy.contains("Bug in login form")
                .closest(".glass-dark")
                .should("have.class", "hover:border-blue-500/30");
        });
    });
});
