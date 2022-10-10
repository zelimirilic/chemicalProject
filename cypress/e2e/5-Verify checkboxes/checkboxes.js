/// <reference types="Cypress" />


describe("Move, copy and delete product in chemsoft", () => {

    beforeEach(function () {
        cy.visit("/");
        cy.get('.nav-link').contains('Tools').click();
    });

    it("Check product and move it on desired department", () => {

        cy.get('[href="/system/chemicals/inventory"]').click();
        cy.get('.d-flex > :nth-child(2) > .icon-move').click({ force: true });
        cy.get(':nth-child(2) > .d-flex > :nth-child(2) > .icons').click({ force: true });
        cy.get('.eqtree-children > :nth-child(2) > span > a').click({ force: true });
        cy.get('[title="OK"]').click({ force: true });
        //cy.get('.tickerWrap > :nth-child(2) > div').should('have.text', 'We\'re sorry to inform you that something went wrong processing your request.'); - the bug is reproduced and catched
        cy.get('.title > span').should('have.text', 'Last modified:');
        cy.url().should('include', 'chemicals/inventory');

    });

    it("Check product and copy it on desired department", () => {

        cy.get('[href="/system/chemicals/inventory"]').click();
        cy.get('.d-flex > :nth-child(2) > .icon-move').click({ force: true });
        cy.get('.mainTtl > :nth-child(1) > .d-flex > :nth-child(2)').click({ force: true });
        cy.get('.eqtree-open > .eqtree-children > :nth-child(2) > span > a').click({ multiple: true });
        cy.get('[title="OK"]').click({ force: true });
        //cy.get('.tickerWrap > :nth-child(2) > div').should('not.have.text', 'We\'re sorry to inform you that something went wrong processing your request.'); - the bug is reproduced and catched
        cy.get('.title > span').should('have.text', 'Last modified:');
        cy.url().should('include', 'chemicals/inventory');


    });

    it.skip("Check frontEnd BUG", () => {

        cy.visit("https://dev04/system/login/chemsofttest");
        cy.get('[name="user"]').click();
        cy.get('.username > .form-control').type("miljan");
        cy.get('.btn').contains('Sign in').click();
        //cy.wait(10000);
        cy.get('.nav-link').contains('Overview').click();
        cy.get('.asideCont > .btn > .icons').click();
        cy.get('.treeClicked').click({ force: true });
        cy.get('.tickerWrap > :nth-child(1) > div').should('have.text', 'We\'re sorry to inform you that something went wrong processing your request.'); //- the bug is reproduced and catched
        //cy.get('.title > span').should('have.text', 'Last modified:');
        //cy.url().should('include', 'chemicals/inventory');


    });

});