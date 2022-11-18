/// <reference types="Cypress" />
//import Homepage_PO from '../../support/pageObjectsModel/Homepage_POM'

import { visitHomepage, clickOnSignIn } from "../../support/pageFunctionsModel/Homepage_PFM";

describe("Interact with drop-down list", () => {

    beforeEach(() => {
        visitHomepage();
        clickOnSignIn();
        cy.get('.nav-link').contains('List').click();
    });

    it("Find specific values in drop-down Process category list on Handling step in Chemsoft", () => {

        cy.get('.dropdown-item').contains('Risk assessment').click({force:true});
        cy.get(".prodName").eq(4).click({force:true});
        cy.get(':nth-child(1) > td.prodName > a').click();
        cy.get(".form-control > *").each(($el, index, $list) => {
            const prod = $el.text();
            const productToSelect = "Svenska";
            console.log("Index: " + index + " : " + $el.text());

            if (prod === productToSelect) {
                $el.trigger("click");
                cy.contains('Svenska').should('have.value', '2').click({ force: true });
            }
        });
        cy.get('.pt-4 > .col-3').contains("Activity");

    });

    it("Select specific values in drop-down Ventilation list on Handling step in Chemsoft", () => {

        cy.get('.dropdown-item').contains('Risk assessment').click({force:true});
        cy.get(".prodName").eq(5).click({force:true});
        cy.get(':nth-child(2) > .prodName > a').click();
        cy.get(".form-control > *").each(($el, index, $list) => {
            const prod = $el.text();
            const productToSelect = "";
            console.log("Index: " + index + " : " + $el.text());

            if (prod === productToSelect) {
                $el.trigger("click");
                cy.contains('Svenska').should('have.value', '2').click({ force: true });
            }
        });
        cy.get(':nth-child(1) > .align-items-center > .col-3').contains("Department");

    });

    it("Select specific values in drop-down Handling type list on Handling step in Chemsoft", () => {

        cy.get('.dropdown-item').contains('Risk assessment').click({ force: true });
        cy.get(".prodName").eq(6).click({ force: true });
        cy.get(':nth-child(1) > td.prodName > a').click();
        cy.get(".form-control > *").each(($el, index, $list) => {
            const prod = $el.text();
            const productToSelect = "";
            console.log("Index: " + index + " : " + $el.text());

            if (prod === productToSelect) {
                $el.trigger("click");
                cy.contains('Svenska').should('have.value', '2').click({ force: true });
            }
        });
        cy.get(':nth-child(1) > :nth-child(4) > .col-3').contains("Additional sources of risk:");

    });
});