/// <reference types="Cypress" />

//import Homepage_PO from '../../support/pageFunctionsModel/Homepage_PFM';

import { visitHomepage, clickOnSignIn } from "../../support/pageFunctionsModel/Homepage_PFM";


describe("Test Login form via Chemsoft NG", () => {

    beforeEach(() => {
        visitHomepage();
        clickOnSignIn();
        cy.get('.nav-link').contains('List').click();
    });

    it("Should be able to log in via Login form", () => {
        cy.get('a > img[alt="Chemsoft"]').should('have.attr', 'alt', 'Chemsoft');
    });

    it("Should not be able to log in via Login form", () => {
        cy.get('a > img[alt="Chemsoft"]').should('have.attr', 'alt', 'Chemsoft');
    });
});

describe("Test Login form via Chemsoft NG - failed login", () => {
    it("Should not be able to log in via Login form - wrong user name", () => {
        visitHomepage();
        cy.get('[name="user"]').click();
        cy.get('.username > .form-control').type("somewrongUsername");
        cy.get('.password > .form-control').type("somewrongpassword");
        cy.get('.btn').contains('Sign in').click();
        cy.get('.alerts').should('have.html', '<div data-test="alert-message" class="d-flex mr-auto">Wrong username or password</div><button type="button" class="close ml-3"><span>×</span></button>');
        //cy.get('.alerts').should('have.html', '<div class="d-flex mr-auto">Wrong username or password</div><button type="button" class="close ml-3"><span>×</span></button>');
        cy.get('.alerts').should('have.text', 'Wrong username or password×');
    });

    /* ==== Test Created with Cypress Studio ==== */
    it('Login via wrong Username and password', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.visit('https://dev04/system/login/chemsofttest');
        cy.get('[data-test="user-name"]').clear('somewrongUsername');
        cy.get('[data-test="user-name"]').type('somewrongUsername');
        cy.get('[data-test="password"]').clear('sa');
        cy.get('[data-test="password"]').type('sasasasassas');
        cy.get('[data-test="sign-in"]').click();
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-test="alert-message"]').should('have.attr', 'data-test', 'alert-message');
        cy.get('[data-test="alert-message"]').should('be.visible');
        cy.get('.welcomeTxt > [data-test="intro-text"]').should('have.attr', 'data-test', 'intro-text');
        cy.get('.welcomeTxt > [data-test="intro-text"]').should('be.visible');
        cy.get('.welcomeTxt > [data-test="info-text"]').should('have.attr', 'data-test', 'info-text');
        cy.get('.welcomeTxt > [data-test="info-text"]').should('be.visible');
        /* ==== End Cypress Studio ==== */
    });
});