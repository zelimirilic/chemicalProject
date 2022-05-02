/// <reference types="Cypress" />

import Homepage_PO from '../../support/pageObjects/Homepage_PO'

describe("Test mouse actions", () => {

    beforeEach(function () {
        const homePage_PO = new Homepage_PO();
        homePage_PO.visitHomepage();
        homePage_PO.clickOnSignIn();
        cy.get('.rightMenu > [style=""] > .nav-link').click();
        cy.get('.dropdown-item').contains('Form Creator').click();
    });

    it.only("Scroll element into view", () => {

        cy.get('.nav > :nth-child(2) > .nav-link').click();
        cy.get('.icon-usagegroup').scrollIntoView().click({ force: true });



    });

    it("Drag and drop a draggable item on Form creator feature", () => {


        cy.get('.nav > :nth-child(2) > .nav-link').click();
        cy.get(':nth-child(1) > .bigIcn').should('have.attr', 'title', 'Product type');
        cy.get(':nth-child(1) > .bigIcn').trigger('mousedown');
        cy.get('.pt-3 >').trigger('mousemove').trigger('mouseup', { force: true });

        cy.get(':nth-child(2) > .form-group > label').should('have.class', 'form-control-label');

        cy.get('.form-control-label').should('contain.text', 'Product type');


    });


});