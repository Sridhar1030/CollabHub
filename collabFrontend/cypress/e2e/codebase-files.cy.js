/// <reference types="cypress" />

/**
 * E2E Tests for Code/Codebase Files Component
 * Tests file tree navigation, file content display, and directory expansion
 */
describe("Codebase Files (Code Tab)", () => {
    beforeEach(() => {
        cy.visitWithMocks();
        cy.wait("@getRepositories");

        // Select a repository
        cy.contains("button", "test-repo").click();
        cy.wait("@getLogs");
        cy.wait("@getCodebase");
    });

    describe("File Tree Display", () => {
        it("should display the file tree", () => {
            cy.get(".glass-dark").should("exist");
        });

        it("should display root level items", () => {
            cy.contains("src").should("be.visible");
            cy.contains("package.json").should("be.visible");
            cy.contains("README.md").should("be.visible");
        });

        it("should display folder icons for directories", () => {
            cy.contains("src").parent().should("contain", "📁");
        });

        it("should display file icons for files", () => {
            cy.contains("package.json").parent().should("contain", "📋");
        });
    });

    describe("Directory Expansion", () => {
        it("should expand directory when clicked", () => {
            cy.contains("src").click();

            // Should show children
            cy.contains("index.js").should("be.visible");
            cy.contains("App.js").should("be.visible");
            cy.contains("components").should("be.visible");
        });

        it("should show open folder icon when expanded", () => {
            cy.contains("src").click();

            cy.contains("src").parent().should("contain", "📂");
        });

        it("should collapse directory when clicked again", () => {
            cy.contains("src").click();
            cy.contains("index.js").should("be.visible");

            cy.contains("src").click();
            cy.contains("index.js").should("not.exist");
        });

        it("should expand nested directories", () => {
            cy.contains("src").click();
            cy.contains("components").click();

            cy.contains("Header.jsx").should("be.visible");
            cy.contains("Footer.jsx").should("be.visible");
        });
    });

    describe("File Selection", () => {
        it("should highlight selected file", () => {
            cy.contains("src").click();
            cy.contains("index.js").click();
            cy.wait("@getFileContent");

            cy.contains("index.js")
                .parent()
                .should("have.class", "bg-gradient-to-r");
        });

        it("should fetch file content when file is clicked", () => {
            cy.contains("src").click();
            cy.contains("index.js").click();

            cy.wait("@getFileContent")
                .its("request.url")
                .should("include", "src/index.js");
        });

        it("should display file content", () => {
            cy.contains("src").click();
            cy.contains("index.js").click();
            cy.wait("@getFileContent");

            // File content should be displayed
            cy.contains("Hello World").should("be.visible");
        });
    });

    describe("File Icons by Type", () => {
        it("should show correct icon for JavaScript files", () => {
            cy.contains("src").click();
            cy.contains("index.js").parent().should("contain", "⚡");
        });

        it("should show correct icon for JSX files", () => {
            cy.contains("src").click();
            cy.contains("components").click();
            cy.contains("Header.jsx").parent().should("contain", "⚛️");
        });

        it("should show correct icon for JSON files", () => {
            cy.contains("package.json").parent().should("contain", "📋");
        });

        it("should show correct icon for Markdown files", () => {
            cy.contains("README.md").parent().should("contain", "📝");
        });
    });

    describe("Loading States", () => {
        it("should show loading while fetching file tree", () => {
            cy.intercept("GET", "**/codebase/*/*", {
                delay: 500,
                statusCode: 200,
                body: { "test.js": { type: "file" } },
            }).as("delayedCodebase");

            cy.contains("button", "sample-project").click();

            // Loading state should appear
            cy.contains("Loading file tree").should("be.visible");
        });
    });

    describe("Error States", () => {
        it("should show error when file tree fails to load", () => {
            cy.intercept("GET", "**/codebase/*/*", {
                statusCode: 500,
                body: { error: "Server error" },
            }).as("failedCodebase");

            cy.visit("/");
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();

            cy.wait("@failedCodebase");
            cy.contains("Error").should("be.visible");
        });
    });

    describe("Empty Codebase", () => {
        it("should show empty state when no files", () => {
            cy.intercept("GET", "**/codebase/*/*", {
                statusCode: 200,
                body: {},
            }).as("emptyCodebase");

            cy.visit("/");
            cy.wait("@getRepositories");
            cy.contains("button", "test-repo").click();
            cy.wait("@emptyCodebase");

            cy.contains("No files available").should("be.visible");
        });
    });
});
