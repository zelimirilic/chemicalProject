import Homepage_PO from '../../support/pageObjects/Homepage_PO'
/// <reference types="Cypress" />

describe("Iterate over elements", () => {

    beforeEach(function () {
        const homePage_PO = new Homepage_PO();
        homePage_PO.visitHomepage();
        homePage_PO.clickOnSignIn();
        cy.get('.nav-link').contains('List').click();
    });

    it("Log information of product", () => {

        cy.get(".prodNo").each(($el, index, $list) => {
            //console.log("Index: " + index + " : " + $el.text());
            //cy.log("Index: " + index + " : " + $el.text());
        });
        cy.get(".prodNo").eq(4).invoke('text').as('prodNo');
        cy.get('@prodNo').its('length').should('be.gt', 0);
        //cy.get('@prodNo').should('include', 'Sigma');
    });

    it("Validate a first specific product", () => {

        cy.get(".prodNo").eq(1).invoke('text').as('prodNo');
        cy.get('@prodNo').its('length').should('be.gt', 0);
        cy.get('@prodNo').should('include', 'Sigma');
    });

    it("Validate a second specific produc", () => {

        cy.get(".prodNo").eq(1).invoke('text').as('prodNo');
        cy.get('@prodNo').its('length').should('be.gt', 0);
        cy.get('@prodNo').should('include', 'Sigma 309451Test');

    });

    it("Validate a third specific produc", () => {

        cy.get('.tablinks').contains('Assembled').click();
        cy.get(".prodName").eq(2).invoke('text').as('prodName');
        cy.get('@prodName').its('length').should('be.gt', 0);
        cy.get('@prodName').should('include', "(-)-3',5'-O-(1,1,3,3-TETRAISOPROPYL-1,3-");


    });

    it("Validate a fourth specific produc", () => {

        cy.get('.tablinks').contains('Assembled').click();
        cy.get(".symbols").as('symbol');
        cy.get('@symbol').should('have.length', 21);
        cy.get('@symbol').find(".iconPx24").invoke('attr', 'title').should('include', 'Xi');

    });

    it("Validate a fifth specific produc", () => {

        cy.get('.prodNo').eq(1).then(($headerText) => {
            const headerText = $headerText.text();
            cy.log(headerText).its('length').should('be.gt', 0);

        });

    });


});