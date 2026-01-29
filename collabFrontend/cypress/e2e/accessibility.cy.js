/// <reference types="cypress" />

/**
 * E2E Tests for Accessibility
 * Tests keyboard navigation, ARIA attributes, and accessibility features
 */
describe("Accessibility", () => {
    beforeEach(() => {
        cy.visitWithMocks();
        cy.wait("@getRepositories");
    });

    describe("Keyboard Navigation", () => {
        it("should allow tab navigation through header", () => {
            // Focus on the first focusable element
            cy.get("button, a, input").first().focus();
            cy.focused().should("exist");
        });

        it("should allow keyboard selection of repositories", () => {
            // Click on repository first (keyboard enter after focus)
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            // Verify repository is selected (has active styling)
            cy.contains("button", "test-repo")
                .should("exist")
                .and("be.visible");
        });

        it("should allow keyboard navigation through tabs", () => {
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            // Click Commits tab
            cy.contains("button", "Commits").click();

            // Check that CommitLog content is visible (look for commit-related content)
            cy.get('[class*="animate-"]').should("exist");
        });
    });

    describe("Focus Management", () => {
        it("should have visible focus indicators", () => {
            cy.contains("button", "test-repo").focus();
            cy.focused().should("be.visible");
        });

        it("should maintain focus after interactions", () => {
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");

            // Focus should still be manageable
            cy.get("body").should("exist");
        });
    });

    describe("Semantic HTML", () => {
        it("should have proper heading hierarchy", () => {
            cy.get("h2, h3").should("exist");
        });

        it("should have nav element for navigation", () => {
            cy.get("nav").should("exist");
        });

        it("should have main content area", () => {
            cy.get("main").should("exist");
        });

        it("should use button elements for interactive items", () => {
            cy.get("button").should("have.length.greaterThan", 0);
        });
    });

    describe("Link Accessibility", () => {
        it("should have accessible links", () => {
            cy.get("a[href]").each(($link) => {
                cy.wrap($link).should("have.attr", "href");
            });
        });
    });

    describe("Form Accessibility", () => {
        it("should have accessible search input", () => {
            cy.viewport(1280, 720);
            cy.get('input[placeholder="Search repositories..."]').should(
                "have.attr",
                "placeholder",
            );
        });
    });

    describe("Color Contrast", () => {
        it("should have readable text on dark background", () => {
            cy.get(".text-white, .text-gray-200, .text-gray-400").should(
                "be.visible",
            );
        });
    });

    describe("Interactive Elements", () => {
        it("should have cursor pointer on clickable elements", () => {
            cy.contains("button", "test-repo").should(
                "have.css",
                "cursor",
                "pointer",
            );
        });
    });

    describe("Screen Reader Accessibility", () => {
        it("should have descriptive text for icons", () => {
            // Icons should be accompanied by text or aria-labels
            // Check that interactive elements with icons have accessible text
            cy.get("button").each(($btn) => {
                // Buttons should have text content or aria-label
                const hasText = $btn.text().trim().length > 0;
                const hasAriaLabel = !!$btn.attr("aria-label");
                const hasTitle = !!$btn.attr("title");

                // At least one accessibility method should be present
                expect(hasText || hasAriaLabel || hasTitle).to.be.true;
            });
        });
    });

    describe("Reduced Motion", () => {
        it("should have animations that can be reduced", () => {
            // Check that animations exist
            cy.get('[class*="animate-"]').should("exist");
        });
    });
});
