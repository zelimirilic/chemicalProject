import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";


Given('I access to Chemsoft Login portal page', () => {
    cy.visit("https://dev04/system/login/chemsofttest");
})

When('I enter a username {word}', (username) => {
    cy.get('.username > .form-control').type(username);
})

And('I enter a password {word}', (username) => {
    cy.get('.password > .form-control').type(username);
})

And('I click on Sign in', () => {
    cy.get('.bigBtn ').contains('Sign in').click();
})

Then('I should get a new page {word}', (username) => {
    cy.get('a > img[alt="Chemsoft"]').should('have.attr', 'alt', username);
})
