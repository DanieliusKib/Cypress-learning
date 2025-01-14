it('Skelbiu', () => {

    const email = 'danielius.kibilda@gmail.com';
    const password = 'm7&KS^A6$#9TY716#5SLgAj%B';

    cy.visit('https://www.skelbiu.lt/users/signin');

    cy.get('#onetrust-banner-sdk')
        .should('have.css', 'bottom', '0px');


    cy.get('#onetrust-accept-btn-handler').click();

    cy.get('#nick-input').type(email);
    cy.get('#password-input').type(password);
    cy.get('#submit-button').click();


    cy.get('.close-button').click();

    cy.get('#updateAds').click();

    let retryCount = 0;

    function checkAndRefresh() {
        cy.get('body').then(($body) => {
            const button = $body.find('button:contains("Atnaujinti")');
            if (button.length > 0 && button.is(':visible')) {
                cy.wrap(button).click(); // Focus or perform other actions on the button
            } else {

                retryCount++;

                if (retryCount >= 90) {
                    // Fail the test intentionally after 30 retries
                    throw new Error("Button not found or visible after 90 attempts or 30 minutes");
                } else {
                    // Button is not visible, wait 500ms, refresh, and retry
                    cy.wait(20000);
                    cy.reload();
                    checkAndRefresh(); // Recursive call to check again
                }
            }
        });
    }

    checkAndRefresh();






});
