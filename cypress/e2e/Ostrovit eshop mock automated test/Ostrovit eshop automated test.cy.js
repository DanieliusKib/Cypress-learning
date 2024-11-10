describe('Ostrovit', () => {

    beforeEach(() => {
        // Visit the login page for each test case
        cy.visit('https://ostrovit.com/en/login.html', {
            headers: {
                'Accept-Language': 'en'
            }
        });
        //accept cookies button
        cy.contains('I confirm all').click();

        //Login to website
        cy.LoginOstrovit(Cypress.env('EMAIL'), Cypress.env('PASSWORD')); //dotenv package used to obfuscate my email and password 

        //Will empty cart if it's not empty
        cy.EmptyCart();
    });

    it('ostrovit Search for product that does not exist', () => {

        // Set product keyword and full name
        const productKeyWord = 'Vitamin';
        const ProductFullName = 'Vitamin Z';

        cy.searchForProduct(productKeyWord, ProductFullName, false);

    });

    it('ostrovit Search for product that exists on first page', () => {

        // Set product keyword and full name
        const productKeyWord = 'mat';
        const ProductFullName = 'Acupressure mat and pillow';
        // Search for the product and verify the cart
        //3rd, should the script enter full product page or just add to cart - true false
        cy.searchForProduct(productKeyWord, ProductFullName, false).then((product) => {
            // Check if the product was found
            if (product) {
                const { ProductID, ProductPrice } = product;

                // Call CartVerify with the expected product count, worth, and product ID
                cy.CartVerify(1, ProductPrice, ProductID); // Assuming 1 product and price as the total worth
            } else {
                throw new Error('Product not found in the cart.');
            }
        });

    });

    it('ostrovit Search for product that exists after clicking "Load more products" ', () => {

        // Set product keyword and full name
        const productKeyWord = 'Vitamin';
        const ProductFullName = 'D.A.A 3000 mg 90 capsules';

        cy.searchForProduct(productKeyWord, ProductFullName, false).then((product) => {
            // Check if the product was found
            if (product) {
                const { ProductID, ProductPrice } = product;

                // Call CartVerify with the expected product count, worth, and product ID
                cy.CartVerify(1, ProductPrice, ProductID); // Assuming 1 product and price as the total worth
            } else {
                throw new Error('Product not found in the cart.');
            }
        });
    });


});