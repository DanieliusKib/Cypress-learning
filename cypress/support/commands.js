// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-file-upload';
import 'cypress-real-events/support';

require('cypress-downloadfile/lib/downloadFileCommand')

Cypress.Commands.add('dragAndDrop', (source, target) => {
    cy.get(source).then($source => {
        const dataTransfer = new DataTransfer();
        cy.get(source).trigger('dragstart', { dataTransfer });
        cy.get(target).trigger('drop', { dataTransfer });
    });
});


Cypress.Commands.add('LoginOstrovit', (email, password) => {
    cy.get('input[name="login"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.contains('button[type="submit"]', 'Log in').click();
});

Cypress.Commands.add('PLaygroundsLoginForm', (username, password) => {
    cy.get('#user').type(username);
    cy.get('#password').type(password);
    cy.get('#login').click();
});



Cypress.Commands.add('CartVerify', (Product_count, WholeWorth, productID) => {

    //API
    cy.intercept('POST', '/ajax/get.php').as('getShoppingCart');

    cy.get('#logo').click();


    cy.wait('@getShoppingCart').then((interception) => {


        const responseBody = JSON.parse(interception.response.body);

        expect(responseBody.Basket.response.basket.productsNumber).to.equal(Number(Product_count));
        expect(responseBody.Basket.response.basket.worth).to.equal(Number(WholeWorth));
        expect(responseBody.Basket.response.basket.products[0].id).to.equal(productID);

    });
});


Cypress.Commands.add('searchForProduct', (productKeyWord, ProductFullName, EnterFullProductPage) => {
    cy.get('#menu_search_text').type(productKeyWord); // Enter keyword to search
    cy.get('.menu__search-wrapper').find('button[type="submit"]').click(); // Click search

    // Return the function to make it chainable
    return CheckIfProductIsLoadedOnPage();

    function CheckIfProductIsLoadedOnPage() {
        return cy.get('body').then(($body) => {
            if ($body.find(`:contains(${ProductFullName})`).length > 0) { // Check if page loaded the product
                // Extract and return product ID
                return cy.get('.product').contains('.product__name-link', ProductFullName).parents('.product').contains('Add to cart').then(($addtocartbutton) => {

                    const ProductIDExtract = $addtocartbutton.attr('data-product');
                    const ProductPriceExtract = parseFloat($addtocartbutton.parents('.product').find('.price').text().replace('€', '').replace(',', '.').trim());

                    if (EnterFullProductPage) {
                        cy.contains('.product__name-link', ProductFullName).click(); // Enter product page
                        cy.contains('span', 'Add to cart').click(); // Click 'Add to cart'
                    }
                    else {
                        cy.get('.product')
                            .contains('.product__name-link', ProductFullName)
                            .parents('.product')
                            .contains('Add to cart')
                            .click(); // Add to cart without entering product page
                    }

                    return cy.wrap({ ProductID: ProductIDExtract, ProductPrice: ProductPriceExtract });


                });
            }
            else {
                return cy.get('body').then(($ProductsLoaded) => {
                    if ($ProductsLoaded.text().includes('You have viewed all the products')) {
                        cy.log('⚠️ All products loaded, still not found ⚠️');
                        return cy.wrap(null); // Return null if product not found
                    }
                    else {
                        // Load more products if the product is not yet found
                        return LoadMoreProducts().then(() => CheckIfProductIsLoadedOnPage());
                    }
                });
            }
        });
    }

    function LoadMoreProducts() {
        return cy.get('.search__load-next.d-flex.justify-content-center').then(($MoreProductsButton) => {
            if ($MoreProductsButton.find('.btn.--solid.--medium.--loading').length > 0) {
                cy.wait(500);
                return cy.get('body').then(($ProductsLoaded) => {
                    if ($ProductsLoaded.text().includes('You have viewed all the products')) {
                        return cy.wrap(null); // Return null if all products loaded
                    }
                    else {
                        return LoadMoreProducts(); // Continue loading if products still loading
                    }
                });
            }
            else {
                cy.get('.search__load-next.d-flex.justify-content-center .btn.--solid.--medium').as('LoadMore');
                cy.get('@LoadMore').click();
                cy.wait(500);
            }
        });
    }
});

Cypress.Commands.add('EmptyCart', () => {
    cy.get('.menu__link-wrapper').find('span', '.counter ').then($el => {//checking if counter on the shopping cart is present, indicating cart is not empty
        // Check if the element is visible
        if ($el.is(':visible')) {
            cy.wrap($el).click();//clicking on cart counter to access the cart
            cy.get('.basket__tools').contains('Clear cart').click();//click on clear cart
            cy.get('#logo').click(); //click on logo to go back to main page
        } else {
            cy.log('shopping cart is empty, skipping empty cart action');
        }
    });
});
