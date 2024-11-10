describe('Testing dynamic element handling', () => {
  
    it('Waiting for loading bar to dissapear and validate text appears', () => {
  
      cy.visit('https://practice.expandtesting.com/dynamic-loading/1');
      cy.get('#loading').should('not.exist');
      cy.contains('Hello World!').should('not.be.visible');
  
      cy.contains('Start').click();
  
      cy.contains('Hello World!').should('not.be.visible');
  
      cy.get('#loading').should('be.visible');
      cy.get('#loading', { timeout: 10000 }).should('not.be.visible');
  
      cy.contains('Hello World!').should('be.visible');
  
    });
  
    it('Waiting for loading bar to dissapear and validate text appears, rendered after the fact', () => {
  
      cy.visit('https://practice.expandtesting.com/dynamic-loading/2');
      cy.get('#loading').should('not.exist');
      cy.contains('Hello World!').should('not.exist');
  
      cy.contains('Start').click();
  
      //cy.contains('Hello World!').should('not.be.visible');
  
      cy.get('#loading').should('be.visible');
      cy.get('#loading', { timeout: 10000 }).should('not.be.visible');
  
      cy.contains('Hello World!').should('exist').should('be.visible');
  
    });
  

    it.only('infinite scroll', () => {
      cy.visit('https://infinite-scroll-test.stackblitz.io/');
      cy.contains('button', 'Run this project', { timeout: 6000 }).should('be.visible').click();
    
      function scrollUntilVisible() {
        cy.get('body').then(($body) => {
          // Check if a div with _ngcontent-c0 contains '390'
          const $target = $body.find('div[_ngcontent-c0]').filter((_, el) => el.textContent.trim() === '400');
    
          if ($target.length > 0 && Cypress.$($target).is(':visible')) {
            // If the element exists and is visible
            cy.log('Element found and visible');
          } else {
            // If the element is not found or not visible, scroll the panel
            cy.get('.search-results').then(($panel) => {
              const initialHeight = $panel[0].scrollHeight;
    
              cy.get('.search-results').scrollTo('bottom').then(() => {
                // Wait until the scroll height changes or some new content appears
                cy.get('.search-results').should(($panel) => {
                  expect($panel[0].scrollHeight).to.be.greaterThan(initialHeight);
                });
    
                // Call the function again to continue scrolling if needed
                scrollUntilVisible();
              });
            });
          }
        });
      }
    
      // Start the scrolling function
      scrollUntilVisible();
    })
    
    //does not work with 1000

});