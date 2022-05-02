/// <reference types="Cypress" />

import Homepage_PO from '../../support/pageObjects/Homepage_PO'

describe("Interact with drop-down list", () => {

    beforeEach(function () {
        const homePage_PO = new Homepage_PO();
        homePage_PO.visitHomepage();
        homePage_PO.clickOnSignIn();
        cy.get('.nav-link').contains('Tools').click();
    });

    it("Find specific values in drop-down Process category list on Handling step in Chemsoft", () => {

        cy.get('.dropdown-item').contains('Risk assessment').click();
        cy.get(".prodName").eq(4).click();
        cy.get('.tab > :nth-child(1) > .d-flex > :nth-child(2)').click();
        cy.get(".form-control > *").each(($el, index, $list) => {
            const prod = $el.text();
            const productToSelect = "PROC21 - Low energy manipulation and handling of substances bound in/on materials or articles";
            console.log("Index: " + index + " : " + $el.text());

            if (prod === productToSelect) {
                $el.trigger("click");
                cy.contains('PROC21 - Low energy manipulation and handling of substances bound in/on materials or articles').should('have.value', '23').click({ force: true });
            }
        });
        cy.get(".statements").should('contain.text', 'PROC21 - Low energy manipulation and handling of substances bound in/on materials or articles');

    });

    it("Select specific values in drop-down Ventilation list on Handling step in Chemsoft", () => {

        cy.get('.dropdown-item').contains('Risk assessment').click();
        cy.get(".prodName").eq(5).click();
        cy.get('.tab > :nth-child(1) > .d-flex > :nth-child(2)').click();
        cy.get(".form-control > *").each(($el, index, $list) => {
            const prod = $el.text();
            const productToSelect = "Small and non-ventilated room";
            console.log("Index: " + index + " : " + $el.text());

            if (prod === productToSelect) {
                $el.trigger("click");
                cy.contains('Small and non-ventilated room').should('have.value', '2').click({ force: true });
            }
        });
        cy.get('.row > :nth-child(1) > :nth-child(3) > .input-group > .form-control').should('contain.text', 'Small and non-ventilated room');

    });

    it("Select specific values in drop-down Handling type list on Handling step in Chemsoft", () => {

        cy.get('.dropdown-item').contains('Risk assessment').click();
        cy.get(".prodName").eq(6).click();
        cy.get('.tab > :nth-child(1) > .d-flex > :nth-child(2)').click();
        cy.get(".form-control > *").each(($el, index, $list) => {
            const prod = $el.text();
            const productToSelect = "Handling in small scale";
            console.log("Index: " + index + " : " + $el.text());

            if (prod === productToSelect) {
                $el.trigger("click");
                cy.contains('Handling in small scale').should('have.value', '2').click({ force: true });
            }
        });
        cy.get(':nth-child(2) > :nth-child(1) > .row > :nth-child(2) > .form-group > .input-group > .form-control').should('contain.text', 'Handling in small scale');

    });
});