/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to set up all API mocks
         * @example cy.mockApi()
         */
        mockApi(): Chainable<void>;

        /**
         * Custom command to visit the app with mocked API
         * @example cy.visitWithMocks()
         */
        visitWithMocks(): Chainable<void>;

        /**
         * Custom command to select a repository
         * @example cy.selectRepository('my-repo')
         */
        selectRepository(repoName: string): Chainable<void>;

        /**
         * Custom command to wait for page to load
         * @example cy.waitForPageLoad()
         */
        waitForPageLoad(): Chainable<void>;

        /**
         * Custom command to switch tabs
         * @example cy.switchTab('Commits')
         */
        switchTab(tabName: string): Chainable<void>;

        /**
         * Custom command to check if loading state is displayed
         * @example cy.checkLoadingState()
         */
        checkLoadingState(): Chainable<void>;

        /**
         * Custom command to verify repository is selected
         * @example cy.verifyRepoSelected('my-repo')
         */
        verifyRepoSelected(repoName: string): Chainable<void>;
    }
}
