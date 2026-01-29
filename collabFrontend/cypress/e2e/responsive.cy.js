/// <reference types="cypress" />

/**
 * E2E Tests for Responsive Design
 * Tests application behavior across different viewport sizes
 */
describe("Responsive Design", () => {
    beforeEach(() => {
        cy.visitWithMocks();
        cy.wait("@getRepositories");
    });

    describe("Mobile Viewport (375x667)", () => {
        beforeEach(() => {
            cy.viewport(375, 667);
        });

        it("should display app on mobile", () => {
            cy.get(".min-h-screen").should("be.visible");
        });

        it("should hide navigation links on mobile", () => {
            cy.get(".hidden.md\\:flex").should("not.be.visible");
        });

        it("should hide search bar on mobile", () => {
            cy.get('input[placeholder="Search repositories..."]').should(
                "not.be.visible",
            );
        });

        it("should display logo on mobile", () => {
            cy.contains("CollabHub").should("be.visible");
        });

        it("should display sidebar on mobile", () => {
            cy.contains("Repositories").should("be.visible");
        });

        it("should allow repository selection on mobile", () => {
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            cy.contains("button", "test-repo").should(
                "have.class",
                "bg-blue-500/20",
            );
        });

    });

    describe("Tablet Viewport (768x1024)", () => {
        beforeEach(() => {
            cy.viewport(768, 1024);
        });

        it("should display app on tablet", () => {
            cy.get(".min-h-screen").should("be.visible");
        });

        it("should show navigation on tablet", () => {
            cy.contains("Repositories").should("be.visible");
            cy.contains("Activity").should("be.visible");
        });

        it("should hide search on medium screens", () => {
            cy.get('input[placeholder="Search repositories..."]').should(
                "not.be.visible",
            );
        });

        it("should display sidebar properly", () => {
            cy.get('[class*="w-80"]').should("be.visible");
        });

        it("should display empty state", () => {
            cy.contains("Select a Repository").should("be.visible");
        });
    });

    describe("Desktop Viewport (1280x720)", () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
        });

        it("should display all elements on desktop", () => {
            cy.get(".min-h-screen").should("be.visible");
            cy.contains("CollabHub").should("be.visible");
            cy.contains("Repositories").should("be.visible");
            cy.contains("Activity").should("be.visible");
            cy.get('input[placeholder="Search repositories..."]').should(
                "be.visible",
            );
        });

        it("should have proper sidebar width", () => {
            cy.get('[class*="w-80"]').should("be.visible");
        });

        it("should have proper main content area", () => {
            cy.get(".flex-1").should("be.visible");
        });
    });

    describe("Large Desktop Viewport (1920x1080)", () => {
        beforeEach(() => {
            cy.viewport(1920, 1080);
        });

        it("should constrain content width", () => {
            cy.get('[class*="max-w-"]').should("be.visible");
        });

        it("should center content", () => {
            cy.get(".mx-auto").should("be.visible");
        });
    });

    describe("Viewport Transitions", () => {
        it("should adapt when viewport changes", () => {
            // Start on desktop
            cy.viewport(1280, 720);
            cy.get('input[placeholder="Search repositories..."]').should(
                "be.visible",
            );

            // Switch to mobile
            cy.viewport(375, 667);
            cy.get('input[placeholder="Search repositories..."]').should(
                "not.be.visible",
            );

            // Switch back to desktop
            cy.viewport(1280, 720);
            cy.get('input[placeholder="Search repositories..."]').should(
                "be.visible",
            );
        });
    });

    describe("Touch Interactions", () => {
        beforeEach(() => {
            cy.viewport("iphone-x");
        });


        it("should handle touch on tabs", () => {
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            cy.contains("button", "Commits").click();
            cy.contains("Commit History").should("be.visible");
        });
    });

    describe("Landscape Mobile", () => {
        beforeEach(() => {
            cy.viewport(667, 375);
        });

        it("should display properly in landscape", () => {
            cy.get(".min-h-screen").should("be.visible");
            cy.contains("CollabHub").should("be.visible");
        });
    });
});
