/// <reference types="cypress" />

/**
 * E2E Tests for Header Component
 * Tests navigation, branding, and search functionality
 */
describe("Header Component", () => {
    beforeEach(() => {
        cy.visitWithMocks();
        cy.wait("@getRepositories");
    });

    describe("Logo and Branding", () => {
        it("should display the CollabHub logo", () => {
            cy.get("nav").should("be.visible");
            cy.contains("CollabHub").should("be.visible");
        });

        it("should have logo link that navigates to home", () => {
            cy.contains("a", "CollabHub").should("have.attr", "href", "/");
        });

        it("should display GitHub-style icon", () => {
            cy.get("nav svg").first().should("be.visible");
        });
    });

    describe("Navigation Items", () => {
        it("should display navigation links", () => {
            cy.contains("Repositories").should("be.visible");
            cy.contains("Activity").should("be.visible");
        });

        it("should have proper hover styles on navigation links", () => {
            cy.contains("Repositories")
                .should("have.class", "hover:text-white")
                .should("have.class", "hover:bg-gray-700");
        });
    });

    describe("Search Functionality", () => {
        it("should display search input on large screens", () => {
            cy.viewport(1280, 720);
            cy.get('input[placeholder="Search repositories..."]').should(
                "be.visible",
            );
        });

        it("should allow typing in search input", () => {
            cy.viewport(1280, 720);
            cy.get('input[placeholder="Search repositories..."]')
                .type("test-repo")
                .should("have.value", "test-repo");
        });

        it("should have search icon", () => {
            cy.viewport(1280, 720);
            cy.get('input[placeholder="Search repositories..."]')
                .parent()
                .find("svg")
                .should("be.visible");
        });
    });

    describe("User Avatar", () => {
        it("should display user avatar", () => {
            cy.get("nav")
                .find(".rounded-full")
                .should("be.visible")
                .and("contain", "S");
        });
    });

    describe("Responsive Design", () => {
        it("should hide navigation on mobile", () => {
            cy.viewport(375, 667);
            cy.get("nav").find(".hidden.md\\:flex").should("not.be.visible");
        });

        it("should hide search on small screens", () => {
            cy.viewport(768, 1024);
            cy.get('input[placeholder="Search repositories..."]').should(
                "not.be.visible",
            );
        });

        it("should show all elements on desktop", () => {
            cy.viewport(1280, 720);
            cy.contains("Repositories").should("be.visible");
            cy.contains("Activity").should("be.visible");
            cy.get('input[placeholder="Search repositories..."]').should(
                "be.visible",
            );
        });
    });

    describe("Sticky Navigation", () => {
        it("should have sticky positioning", () => {
            cy.get("nav").should("have.class", "sticky");
        });
    });
});
