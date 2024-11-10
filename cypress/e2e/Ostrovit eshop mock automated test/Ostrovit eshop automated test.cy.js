it('ostrovit', () => {

    cy.visit('https://ostrovit.com/en/login.html', {
        headers: {
            'Accept-Language': 'en'
        }
    });
    //accept cookies
    cy.get('.acceptAll.btn.--solid.--large').click();
    //Login 
    cy.LoginOstrovit(Cypress.env('EMAIL'), Cypress.env('PASSWORD'));
    //If cart is not empty, empty it, if it's empty, it will skip it


    //cy.EmptyCart();

    //Keyword to search for, exact product to pick after searched by keyword, enter full product page or just add to cart - true false
    cy.searchForProduct('Vitamin', 'asddassda', false);




});