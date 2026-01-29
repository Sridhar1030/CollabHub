/// <reference types="cypress" />

/**
 * E2E Tests for UI Styling and Visual Appearance
 * Tests CSS classes, animations, and visual elements
 */
describe("UI Styling", () => {
    beforeEach(() => {
        cy.visitWithMocks();
        cy.wait("@getRepositories");
    });

    describe("Glass Effect Styling", () => {
        it("should have glass-dark class on panels", () => {
            cy.get(".glass-dark").should("exist");
        });

        it("should have glass effect on sidebar", () => {
            cy.get('[class*="w-80"]').find(".glass-dark").should("exist");
        });
    });

    describe("Gradient Backgrounds", () => {
        it("should have gradient background on app", () => {
            cy.get('[class*="bg-gradient"]').should("exist");
        });

        it("should have gradient on buttons", () => {
            cy.contains("button", "test-repo").click();
            cy.wait("@getLogs");
            cy.wait("@getCodebase");

            cy.contains("button", "Issues").click();
            cy.wait("@getIssues");

            cy.contains("button", "New Issue").should(
                "have.class",
                "bg-gradient-to-r",
            );
        });
    });

    describe("Shadow Effects", () => {
        it("should have shadow on header", () => {
            cy.get("nav").should("have.class", "shadow-lg");
        });

        it("should have shadow on glass panels", () => {
            cy.get(".shadow-glass-lg, .shadow-lg").should("exist");
        });
    });

    describe("Border Styling", () => {
        it("should have border on panels", () => {
            cy.get('[class*="border"]').should("exist");
        });

        it("should have rounded corners", () => {
            cy.get(".rounded-xl, .rounded-lg").should("exist");
        });
    });

    describe("Animations", () => {
        it("should have slide-down animation", () => {
            cy.get(".animate-slide-down").should("exist");
        });

        it("should have spin animation for loaders", () => {
            cy.intercept("GET", "**/log/**", {
                delay: 500,
                statusCode: 200,
                body: "",
            });
            cy.intercept("GET", "**/codebase/*/*", {
                delay: 500,
                statusCode: 200,
                body: {},
            });

            cy.contains("button", "test-repo").click();
            cy.get(".animate-spin").should("exist");
        });

        it("should have pulse animation", () => {
            cy.get('[class*="animate-pulse"]').should("exist");
        });
    });

    describe("Color Scheme", () => {
        it("should use dark theme colors", () => {
            cy.get('.bg-gray-900, [class*="bg-gray"]').should("exist");
        });

        it("should have blue accent color", () => {
            cy.get('[class*="blue-500"], [class*="text-blue"]').should("exist");
        });

        it("should have white text on dark background", () => {
            cy.get(".text-white").should("exist");
        });

        it("should have gray text for secondary content", () => {
            cy.get(".text-gray-400").should("exist");
        });
    });

    describe("Hover Effects", () => {
        it("should have hover scale effect on repository items", () => {
            cy.contains("button", "test-repo").should(
                "have.class",
                "hover:scale-[1.01]",
            );
        });

        it("should have hover color change on buttons", () => {
            cy.contains("button", "test-repo").should(
                "have.class",
                "hover:text-white",
            );
        });
    });

    describe("Transition Effects", () => {
        it("should have transition classes", () => {
            cy.get(".transition-all, .transition-colors").should("exist");
        });

        it("should have duration classes", () => {
            cy.get('[class*="duration-"]').should("exist");
        });
    });

    describe("Icon Styling", () => {
        it("should have properly sized icons", () => {
            cy.get("svg").first().should("be.visible");
        });

        it("should have colored icons", () => {
            cy.get('svg[class*="text-"]').should("exist");
        });
    });

    describe("Typography", () => {
        it("should have font weight variations", () => {
            cy.get(".font-bold, .font-semibold, .font-medium").should("exist");
        });

        it("should have text size variations", () => {
            cy.get(".text-sm, .text-lg, .text-xl, .text-2xl").should("exist");
        });
    });

    describe("Spacing", () => {
        it("should have proper padding", () => {
            cy.get('[class*="p-"], [class*="px-"], [class*="py-"]').should(
                "exist",
            );
        });

        it("should have proper margins", () => {
            cy.get('[class*="m-"], [class*="mx-"], [class*="my-"]').should(
                "exist",
            );
        });

        it("should have gap spacing", () => {
            cy.get('[class*="gap-"], [class*="space-"]').should("exist");
        });
    });

    describe("Scrollbar Styling", () => {
        it("should have custom scrollbar class", () => {
            cy.get('.custom-scrollbar, [class*="overflow-y-auto"]').should(
                "exist",
            );
        });
    });

    describe("Z-Index Layering", () => {
        it("should have z-index on header", () => {
            cy.get("nav").should("have.class", "z-50");
        });

        it("should have z-index on background elements", () => {
            cy.get('.z-10, [class*="z-"]').should("exist");
        });
    });
});
