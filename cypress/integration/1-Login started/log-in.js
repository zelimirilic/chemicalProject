import Homepage_PO from '../../support/pageObjects/Homepage_PO';

/// <reference types="Cypress" />

describe("Test Login form via Chemsoft NG", () => {

    beforeEach(function () {
        const homePage_PO = new Homepage_PO();
        homePage_PO.visitHomepage();

    });

    it("Should be able to log in via Login form", () => {
        cy.get('[name="user"]').click();
        cy.get('.username > .form-control').type("miljan");
        cy.get('.btn').contains('Sign in').click();
        cy.get('a > img[alt="Chemsoft"]').should('have.attr', 'alt', 'Chemsoft');


    });

    it("Should not be able to log in via Login form", () => {

        cy.get('[name="user"]').click();
        cy.get('.username > .form-control').type("zeljko");
        cy.get('.password > .form-control').type("somewrongpassword");
        cy.get('.btn').contains('Sign in').click();
        cy.get('a > img[alt="Chemsoft"]').should('have.attr', 'alt', 'Chemsoft');
        //cy.get('button').should('have.text', 'Update password');

    });

    it("Should not be able to log in via Login form - wrong user name", () => {

        cy.get('[name="user"]').click();
        cy.get('.username > .form-control').type("somewrongUsername");
        cy.get('.password > .form-control').type("somewrongpassword");
        cy.get('.btn').contains('Sign in').click();
        cy.get('.alerts').should('have.html', '<div>Wrong username or password</div><button type="button" class="close ml-auto"><span>×</span></button>');
        cy.get('.alerts').should('have.text', 'Wrong username or password×');
    });
});