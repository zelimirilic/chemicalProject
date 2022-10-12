/// <reference types="Cypress" />

import Homepage_PO from '../../support/pageObjectsModel/Homepage_POM'

describe("Test mouse actions", () => {

    beforeEach(function () {
        const homePage_PO = new Homepage_PO();
        homePage_PO.visitHomepage();
        homePage_PO.clickOnSignIn();
        cy.get('.rightMenu > [style=""] > .nav-link').click();
        cy.get('.dropdown-item').contains('Form Creator').click();
    });

    it("Scroll element into view", () => {

        cy.get('.nav > :nth-child(2) > .nav-link').click();
        cy.get('.icon-usagegroup').scrollIntoView().click({ force: true });



    });

    it.skip("Drag and drop a draggable item on Form creator feature - Product type", () => {


        cy.get('.nav > :nth-child(2) > .nav-link').click();
        cy.get(':nth-child(1) > .bigIcn').should('have.attr', 'title', 'Product type');
        cy.get(':nth-child(1) > .bigIcn').trigger('mousedown');
        cy.get('.pt-3 >').trigger('mousemove').trigger('mouseup', { force: true });

        cy.get(':nth-child(2) > .form-group > label').should('have.class', 'form-control-label');

        cy.get('.form-control-label').should('contain.text', 'Product type');


    });

    it.skip("Drag and drop a draggable item on Form creator feature - Attach document", () => {


        cy.get('.nav > :nth-child(2) > .nav-link').click();
        cy.get(':nth-child(5) > .bigIcn').should('have.attr', 'title', 'Attach document');
        cy.get(':nth-child(5) > .bigIcn').trigger('mousedown');
        cy.get('.pt-3 >').trigger('mousemove').trigger('mouseup', { force: true });

        cy.get(':nth-child(2) > .form-group > label').should('have.class', 'form-control-label');

        cy.get('.form-control-label').should('contain.text', 'Attach document');


    });


});