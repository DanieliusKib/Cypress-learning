describe('API', () => {

    it('API response validation', () => {
        cy.request('https://jsonplaceholder.typicode.com/todos/1').then((response) => {
            const body = response.body;
            //cy.log(JSON.stringify(response.headers));
            cy.log('Status: ', response.status);
            cy.log(JSON.stringify(response.body));
            cy.log('Duration: ', response.duration);

            expect(response.status).to.equal(200);

            // Assert each value in the response body
            expect(body.userId).to.equal(1);          // Check userId is 1
            expect(body.id).to.equal(1);               // Check id is 1
            expect(body.title).to.equal('delectus aut autem'); // Check title is "delectus aut autem"
            expect(body.completed).to.equal(false);    // Check completed is false
        });
    });


    it('Chaining API requests and validating data', () => {
        // Step 1: Retrieve user data
        cy.request('https://jsonplaceholder.typicode.com/users/1').then((userResponse) => {
            const userId = userResponse.body.id; // Get the userId from the first response

            // Assert that userId is 1
            expect(userId).to.equal(1);

            // Step 2: Retrieve posts for the user using the userId from the first request
            cy.request(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`).then((postsResponse) => {
                const posts = postsResponse.body; // Array of posts belonging to user 1

                // Assert that we received posts
                expect(posts).to.be.an('array').and.not.be.empty;

                // Validate that each post belongs to the same userId (1)
                posts.forEach((post) => {
                    expect(post.userId).to.equal(userId);
                });

                // Step 3: Retrieve the details of the first post for additional validation
                const firstPostId = posts[0].id;
                cy.request(`https://jsonplaceholder.typicode.com/posts/${firstPostId}`).then((postResponse) => {
                    const post = postResponse.body;

                    // Validate that the post's userId matches the initial userId
                    expect(post.userId).to.equal(userId);

                    // Additional assertions for the specific post properties if needed
                    expect(post).to.have.property('title');
                    expect(post).to.have.property('body');
                });
            });
        });
    });


    it.only('Ostrovit Cart API', () => {


        cy.visit('https://ostrovit.com/en/login.html', {
            headers: {
                'Accept-Language': 'en'
            }
        });

        //accept cookies
        cy.get('.acceptAll.btn.--solid.--large').click();

        //Login 
        cy.LoginOstrovit('kuh14756@dcobe.com', 'y1.automationc');

        //If cart is not empty, empty it, if it's empty, it will skip it
        cy.EmptyCart();


        cy.searchForProduct('mat', 'Acupressure mat and pillow', false).then(({ ProductID, ProductPrice }) => {

            //const FormattedProductPrice = parseFloat(ProductPrice.replace('€', '').replace(',', '.').trim());

            return cy.CartVerify('1', ProductPrice, ProductID);

        });
        


    });

});
