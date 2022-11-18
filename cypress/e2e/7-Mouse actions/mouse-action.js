/// <reference types="Cypress" />
//import Homepage_PO from '../../support/pageObjectsModel/Homepage_POM'

import { visitHomepage, clickOnSignIn } from "../../support/pageFunctionsModel/Homepage_PFM";

describe("Test mouse actions", () => {
    beforeEach(() => {
        visitHomepage();
        clickOnSignIn();
    });

    it("Scroll element into view", () => {
        cy.get('.rightMenu > [style=""] > .nav-link').click();
        cy.get('.dropdown-item').contains('Form Creator').click();
        cy.get('[href="/system/settings/application_form/new"]').click();
        cy.get(':nth-child(2) > u').click({ force: true });
        cy.get('[title="OK"]').click();
        cy.get(':nth-child(3) > .bigIcn').trigger('mousedown', { force: true });
        cy.get('.col-8').trigger('mouseover').trigger('mouseup', { force: true });
        //cy.get('.icon-usagegroup').scrollIntoView().click({ force: true });
        cy.get('.col-xl').should('be.visible');
        cy.get('[usingdash="true"] > .form-inline').should('be.visible');
        cy.get(':nth-child(4) > u').contains('Publish').should('have.text', 'Publish');
    });

    it("Drag and drop a draggable item on Form creator feature - Product type", () => {

        cy.get('.rightMenu > [style=""] > .nav-link').click();
        cy.get('.dropdown-item').contains('Product type').click();
        cy.get('.treeClicked > a').trigger('mousedown');

        cy.get(':nth-child(2) > .form-group > label').should('have.class', 'form-control-label');
        cy.get('.form-control-label').should('contain.text', 'System language');
    });

    it("Drag and drop a draggable item on Form creator feature - Attach document", () => {

        cy.get('.rightMenu > [style=""] > .nav-link').click();
        cy.get('.dropdown-item').contains('Form Creator').click();
        cy.get('.nav > :nth-child(2) > .nav-link').contains('Predefined').click();
        cy.get('p').contains('Attach document').trigger('mousedown', { force: true });
        cy.get('.col-8').trigger('mouseover').trigger('mouseup', { force: true });
        cy.get(':nth-child(5) > .bigIcn').should('have.attr', 'title', 'Attach document');
        cy.get(':nth-child(2) > .form-group > label').should('have.class', 'form-control-label');
        cy.get('.form-control-label').should('contain.text', 'System language');
    });

    /* ==== Test Created with Cypress Studio ==== */
    it('Drag&Drop elements', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.rightMenu > [style=""] > .nav-link').click();
        cy.get('[href="/system/settings/application_form/new"]').click({ force: true });
        cy.get(':nth-child(2) > u').click({ force: true });
        cy.get('[title="OK"]').click({ force: true });
        cy.get(':nth-child(3) > .bigIcn').trigger('mousedown', { force: true });
        cy.get('.col-8').trigger('mouseover').trigger('mouseup', { force: true });
        cy.get(':nth-child(3) > u').click({ force: true });
        cy.get('.card-body > .form-control').type('a');
        cy.get('[title="OK"]').click({ force: true });
        /* ==== End Cypress Studio ==== */

        /* ==== Generated with Cypress Studio ==== */
        cy.get('.col-xl').should('have.text', '\n\t\tWhere is the product to be used?\n\t\t*');
        cy.get('.col-xl').should('be.visible');
        cy.get('[usingdash="true"] > .form-inline').should('be.visible');
        cy.get(':nth-child(4) > u').contains('Publish').should('have.text', 'Publish');
        /* ==== End Cypress Studio ==== */
    });
});