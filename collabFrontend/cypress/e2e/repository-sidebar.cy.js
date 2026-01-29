/// <reference types="cypress" />

/**
 * E2E Tests for Repository Sidebar
 * Tests repository listing, selection, and empty states
 */
describe("Repository Sidebar", () => {
    beforeEach(() => {
        cy.visitWithMocks();
        cy.wait("@getRepositories");
    });

    describe("Repository List Display", () => {
        it("should display repositories section title", () => {
            cy.contains("h3", "Repositories").should("be.visible");
        });

        it("should display total repository count", () => {
            cy.contains("3 total").should("be.visible");
        });

        it("should display all repositories from API", () => {
            cy.contains("test-repo").should("be.visible");
            cy.contains("sample-project").should("be.visible");
            cy.contains("my-app").should("be.visible");
        });

        it("should have repository icon for each item", () => {
            cy.get('[class*="w-80"]')
                .find("button")
                .each(($btn) => {
                    cy.wrap($btn).find("svg").should("exist");
                });
        });
    });

    describe("Repository Selection", () => {
        it("should highlight selected repository", () => {
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            cy.contains("button", "test-repo").should(
                "have.class",
                "bg-blue-500/20",
            );
        });

        it("should show checkmark on selected repository", () => {
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");

            cy.contains("button", "test-repo")
                .find("svg")
                .last()
                .should("be.visible");
        });

        it("should deselect previous repository when selecting new one", () => {
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            cy.contains("button", "sample-project").click();
            cy.wait("@getLogs");

            cy.contains("button", "test-repo").should(
                "not.have.class",
                "bg-blue-500/20",
            );
            cy.contains("button", "sample-project").should(
                "have.class",
                "bg-blue-500/20",
            );
        });

        it("should load repository data when clicking", () => {
            cy.contains("button", "test-repo").click();

            cy.wait("@getLogs")
                .its("request.url")
                .should("include", "test-repo");
            cy.wait("@getCodebase")
                .its("request.url")
                .should("include", "test-repo");
        });
    });

    describe("Empty State", () => {
        it("should show empty state when no repositories", () => {
            cy.intercept("GET", "**/repositories/**", {
                statusCode: 200,
                body: [],
            }).as("getEmptyRepositories");

            cy.visit("/");
            cy.wait("@getEmptyRepositories");

            cy.contains("No repositories found").should("be.visible");
            cy.contains("Push a repository to get started").should(
                "be.visible",
            );
        });
    });

    describe("Sidebar Styling", () => {
        it("should be sticky", () => {
            cy.get('[class*="w-80"]').find(".sticky").should("exist");
        });

        it("should have glass effect styling", () => {
            cy.get('[class*="w-80"]').find(".glass-dark").should("exist");
        });

        it("should have proper width", () => {
            cy.get('[class*="w-80"]').should("be.visible");
        });
    });

    describe("Hover Effects", () => {
        it("should show hover effect on repository items", () => {
            cy.contains("button", "test-repo").should(
                "have.class",
                "hover-glass",
            );
        });

        it("should scale on hover", () => {
            cy.contains("button", "test-repo").should(
                "have.class",
                "hover:scale-[1.01]",
            );
        });
    });

    describe("Scrollable List", () => {
        it("should have scrollable container", () => {
            cy.get('[class*="max-h-"]').should("have.class", "overflow-y-auto");
        });
    });
});
