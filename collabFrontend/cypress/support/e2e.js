// ***********************************************************
// This file is processed and loaded automatically before your test files.
// You can change the location of this file or turn off automatically serving support files with the 'supportFile' configuration option.
// ***********************************************************

import "./commands";

// Hide fetch/XHR requests in the Cypress command log for cleaner output
const app = window.top;
if (!app.document.head.querySelector("[data-hide-command-log-request]")) {
    const style = app.document.createElement("style");
    style.innerHTML =
        ".command-name-request, .command-name-xhr { display: none }";
    style.setAttribute("data-hide-command-log-request", "");
    app.document.head.appendChild(style);
}

// Global error handler to prevent tests from failing on uncaught exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
    // Return false to prevent the error from failing the test
    console.log("Uncaught exception:", err.message);
    return false;
});
