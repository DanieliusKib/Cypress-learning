// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false here prevents Cypress from failing the test
    // if the error message contains a cross-origin script error.
    if (err.message.includes('cross origin')) {
      return false;
    }
    // You can also ignore other errors based on the message content
    return false; // Ignore all uncaught exceptions
  });
  

  before(() => {
    // disable Cypress's default behavior of logging all XMLHttpRequests and fetches
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  })
  
  