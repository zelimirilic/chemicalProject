/// <reference types="Cypress" />

describe("Validate Chemsoft home page links", () => {
    it("Confirm links redirect to the correct pages - Chemsoft NG", () => {

        cy.visit("https://dev04/system/login/chemsofttest");
        cy.url().should('include', 'chemsofttest');
        cy.get('.username > .form-control').type("miljan");
        cy.get('.btn').contains('Sign in').click();
        cy.url().should('include', 'system');
        cy.wait(10000);
        cy.go('back');
        cy.url().should('include', 'chemsofttest');
        cy.reload();
        cy.url().should('include', 'https://dev04/system/login/chemsofttest');

        cy.get('.username > .form-control').type("miljan");
        cy.get('.btn').contains('Sign in').click();
        cy.url().should('include', 'system');
        cy.wait(10000);
        cy.go('back');
        cy.get('[name="user"]').click();
        cy.get('.username > .form-control').type("wrongUserName");
        cy.get('.btn').contains('Sign in').click();
        cy.get('.alerts').should('have.text', 'Wrong username or password×');

    });

    it("Confirm links redirect to the correct pages - iChemistry", () => {

        cy.visit("https://dev04/main/storaenso");

        cy.get('#user').type("miljan");
        cy.get('#pswd').type("hirsl666");
        cy.get('.ichemistry-button').contains('Sign in').click();
        cy.url().should('include', '~master/application.aspx');

        cy.go('back');
        cy.reload();

        cy.url().should('include', 'https://dev04/main/storaenso');

        cy.get('#user').type("miljan");
        cy.get('#pswd').type("hirsl666");
        cy.get('.ichemistry-button').contains('Sign in').click();
        cy.url().should('include', '~master/application.aspx');

        cy.go('back');

        cy.get('#user').type("miljan");
        cy.get('.ichemistry-button').contains('Sign in').click();
        cy.get('#passErrMsg').should('contain.text', 'The password field is required');
        cy.get('#pswd').type("wrongUserName");
        cy.get('.ichemistry-button').contains('Sign in').click();
        cy.get('.ichemistry-alert').should('contain.text', 'Wrong username or password');

    });
});