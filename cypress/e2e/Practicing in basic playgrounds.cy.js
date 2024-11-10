describe('test suite for playgrounds', () => {

  it('fills out the entire form and validates inputs', () => {

    cy.visit('https://play1.automationcamp.ir/forms.html?')
    //fill experience field
    cy.get('#exp').type('120').should('have.value', '120');

    //Check python and javascript boxes
    cy.get('#check_javascript').check().should('be.checked');
    cy.get('#check_python').check().should('be.checked');

    //validate correct text appears after boxes checked
    cy.get('#check_validate')
      .should('be.visible')
      .and('contain.text', 'PYTHON')
      .and('contain.text', 'JAVASCRIPT');

    //Check rad and validate
    cy.get('#rad_selenium').check().should('be.checked');
    cy.get('#rad_protractor').should('not.be.checked');
    cy.get('#rad_validate').should('have.text', 'SELENIUM');

    //dropdown select value and validate
    cy.get('#select_tool').select('Cypress').should('have.value', 'cyp');
    cy.get('#select_tool').find('option:selected').should('have.text', 'Cypress');

    //choose language from list, click on it, validate, go to next option in the list and do the same
    const languages = [
      { value: 'Java', text: 'java' },
      { value: 'Python', text: 'python' },
      { value: 'JavaScript', text: 'javascript' },
      { value: 'TypeScript', text: 'typescript' },
    ];

    languages.forEach((lang) => {
      cy.get('#select_lang').select(lang.value);
      cy.get('#select_lang_validate').should('have.text', lang.text);
    });

    // alt version

    // for(let i = 0; i<languages.length; i++)
    //{
    //   cy.get('#select_lang').select(languages[i].value);
    //   cy.get('#select_lang_validate').should('have.text', languages[i].text);
    //   //console.log(languages[i]);
    //}
    //

    //fill notes field
    const NoteText = 'lorem ipsum'
    cy.get('#notes').type(NoteText).should('have.value', NoteText);

    //validate if notes text is visible and has correct text
    cy.get('#area_notes_validate')
      .should('be.visible')
      .and('contain.text', NoteText);

    //validate read only field value
    cy.get('[readonly]')
      .should('have.attr', 'placeholder')
      .and('equal', 'Common Sense');

    //before german switch is flipped to true, checking if validation text is not visible and does not contain the text
    cy.get('#german_validate').should('not.be.visible').and('contain.text', '');

    //click on custom flip switch
    cy.get('.custom-control-label').click();

    //validate german validation text is visible and says true
    cy.get('#german_validate')
      .should('be.visible')
      .and('contain.text', 'true');

    //validate slider values
    const Slider_values = [1, 2, 3, 4, 5, 0];

    // Iterate through each value to test the range input
    Slider_values.forEach((Slider_values) => {
      // Set the range input to the specified value
      cy.get('#fluency').invoke('val', Slider_values).trigger('input');
      cy.get('#fluency').click();
      // Validate that the span displays the correct value
      cy.get('#fluency_validate').should('have.text', Slider_values.toString());

    });

    const fileName = ['sample.txt', 'secondfile.txt', 'thirdfile.txt'];

    // upload 1 file and verify message
    cy.get('input[type="file"]').eq(0).attachFile(fileName[0]);
    cy.get('#validate_cv').should('be.visible').and('contain.text', fileName[0]);

    //upload multiple files and verify message
    cy.get('input[type="file"]').eq(1).attachFile([fileName[1], fileName[2]]);
    cy.get('#validate_files').should('be.visible').and('contain.text', fileName[1] + " " + fileName[2]);

    //download file
    cy.get('#download_file').click();
    //validate files existance and text inside
    const filePath = 'cypress/downloads/sample_text.txt';


    cy.readFile(filePath).should('exist');

    cy.readFile(filePath).then((fileContent) => {
      expect(fileContent).to.contain('File downloaded by AutomationCamp');
    });

    const oldFilePath = 'cypress/downloads/sample_text.txt'; // Path of the downloaded file
    const newName = 'sample_text'; // Base name for the renamed file

    // Rename the file using the custom task
    cy.task('renameFile', { oldPath: oldFilePath, newName }).then((newFileName) => {
      // Check that the new file exists
      const newFilePath = `cypress/downloads/${newFileName}`;
      cy.readFile(newFilePath).should('exist');

      // Delete the renamed file
      cy.task('deleteFile', oldFilePath).then((deleted) => {
        expect(deleted).to.be.true; // Ensure the file was deleted successfully
      });

      // Validate the contents of the new file
      cy.readFile(newFilePath).then((content) => {
        expect(content).to.contain('File downloaded by AutomationCamp');
      });
    })

    //validate read only field value
    cy.get('#salary')
      .should('have.attr', 'placeholder')
      .and('equal', 'You should not provide this');
    //validate that the errors for not filled fields are not appearing yet
    cy.get('#invalid_city').should('not.be.visible');
    cy.get('#invalid_state').should('not.be.visible');
    cy.get('#invalid_zip').should('not.be.visible');
    cy.get('#invalid_terms').should('not.be.visible');
    cy.get('#invalidCheck').should('not.be.checked');

    //click to show errors for fields
    cy.get('button[type="submit"].btn-primary').click();
    //validate error messages 
    cy.get('#invalid_city').should('be.visible').and('include.text', 'Please provide a valid city.');
    cy.get('#invalid_state').should('be.visible').and('include.text', 'Please provide a valid state.');
    cy.get('#invalid_zip').should('be.visible').and('include.text', 'Please provide a valid zip.');
    cy.get('#invalid_terms').should('be.visible').and('include.text', 'You must agree before submitting');
    //Enter field, check error message appeared, repeat
    cy.get('#validationCustom03').type('city').should('have.value', 'city')
    cy.get('#invalid_city').should('not.be.visible');
    cy.get('#validationCustom04').type('statislow').should('have.value', 'statislow')
    cy.get('#invalid_city').should('not.be.visible');
    cy.get('#validationCustom05').type('zipper').should('have.value', 'zipper')
    cy.get('#invalid_city').should('not.be.visible');
    cy.get('#invalidCheck').check().should('be.checked');
    cy.get('#invalid_terms').should('not.be.visible');
  })


  it('performs mouse action in another page', () => {

    cy.visit('https://play1.automationcamp.ir/mouse_events.html')

    //manipulate Css to make dropdown appear    
    cy.get('.dropdown-content').invoke('css', 'display', 'block');
    cy.get('#dd_java').should('be.visible').click();


    cy.dragAndDrop('#drag_source', 'h3');
    cy.wait(1000);//show off the result
    cy.dragAndDrop('#drag_source', '#drop_target');

  });

  it('log in page command', () => {

    cy.visit('https://play1.automationcamp.ir/login.html')
    cy.PLaygroundsLoginForm('admin', 'admin');

  });

  it('waits in the playgrounds', () => {
    cy.visit('https://play1.automationcamp.ir/expected_conditions.html');
    //set time for waits
    cy.get('#min_wait').clear().type(10);
    cy.get('#max_wait').clear().type(10);
    //click button to initiate alert
    cy.get('#alert_trigger').click();

    cy.on('window:alert', (str) => {
      // Assert that the alert message is what you expect
      expect(str).to.equal('I am alerting you!');
    });

    cy.get('#min_wait').clear().type(5);
    cy.get('#max_wait').clear().type(5);
    cy.get('#prompt_trigger').click();


    cy.on('window:confirm', (str) => {
      // Assert the message in the confirmation dialog
      expect(str).to.include("Choose wisely...").and.include("It\'s your life!");

      // Return true to simulate clicking "OK", or false to simulate clicking "Cancel"
      return true;
      // return false; // Clicks "Cancel"
    });

  })
});
