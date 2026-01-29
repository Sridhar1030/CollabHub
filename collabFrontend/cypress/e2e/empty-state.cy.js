/// <reference types="cypress" />

/**
 * E2E Tests for Empty State Component
 * Tests display when no repository is selected
 */
describe("Empty State", () => {
    beforeEach(() => {
        cy.visitWithMocks();
        cy.wait("@getRepositories");
    });

    describe("Display", () => {
        it("should show empty state when no repository selected", () => {
            cy.contains("Select a Repository").should("be.visible");
        });

        it("should display instruction text", () => {
            cy.contains("Choose a repository from the sidebar").should(
                "be.visible",
            );
        });

        it("should display folder icon", () => {
            cy.get(".glass-dark").find("svg").should("be.visible");
        });
    });

    describe("Info Tags", () => {
        it("should display Active Projects tag", () => {
            cy.contains("Active Projects").should("be.visible");
        });

        it("should display Team Collaboration tag", () => {
            cy.contains("Team Collaboration").should("be.visible");
        });
    });

    describe("Styling", () => {
        it("should have glass styling", () => {
            cy.get(".glass-dark").should("be.visible");
        });

        it("should have rounded corners", () => {
            cy.contains("Select a Repository")
                .closest(".glass-dark")
                .should("have.class", "rounded-xl");
        });

        it("should have animation class", () => {
            cy.contains("Select a Repository")
                .closest(".glass-dark")
                .should("have.class", "animate-slide-down");
        });
    });

    describe("Hide on Selection", () => {
        it("should hide empty state when repository is selected", () => {
            cy.contains("Select a Repository").should("be.visible");

            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            cy.contains("Select a Repository").should("not.exist");
        });
    });
});
