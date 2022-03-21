/// <reference types="Cypress" />

describe("Iterate over elements", () => {

    it("Log information of product", () => {

        cy.visit("https://dev04/system/login/chemsofttest");
        cy.get('[name="user"]').click();
        cy.get('.username > .form-control').type("miljan");
        cy.get('.btn').contains('Sign in').click();
        cy.get('.nav-link').contains('List').click();
        // cy.get(".prodNo").each(($el, index, $list) => {
        //     cy.log("Index: " + index + " : " + $el.text());

    });

    it("Choose a specific product", () => {

        cy.visit("https://dev04/system/login/chemsofttest");
        cy.get('[name="user"]').click();
        cy.get('.username > .form-control').type("miljan");
        cy.get('.btn').contains('Sign in').click();
        cy.get('.nav-link').contains('List').click();
        cy.get(".prodNo").each(($el, index, $list) => {
            if ($el.text() === 'Sigma 61887') {
                cy.wrap($el).click();
            };

        });
    });

    it("Validate a specific produc", () => {

        cy.visit("https://dev04/system/login/chemsofttest");
        cy.get('[name="user"]').click();
        cy.get('.username > .form-control').type("miljan");
        cy.get('.btn').contains('Sign in').click();
        cy.get('.nav-link').contains('List').click();
        cy.get(".prodNo").eq(1).invoke('text').as('prodNo');
        cy.get('@prodNo').its('length').should('be.gt', 0);
        cy.get('@prodNo').should('include', 'Sigma 309451Test');

    });

    it("Validate a specific produc", () => {

        cy.visit("https://dev04/system/login/chemsofttest");
        cy.get('[name="user"]').click();
        cy.get('.username > .form-control').type("miljan");
        cy.get('.btn').contains('Sign in').click();
        cy.get('.nav-link').contains('List').click();
        cy.get('.tablinks').contains('Assembled').click();
        cy.get(".prodName").eq(2).invoke('text').as('prodName');
        cy.get('@prodName').its('length').should('be.gt', 0);
        cy.get('@prodName').should('include', "(-)-3',5'-O-(1,1,3,3-TETRAISOPROPYL-1,3-");


    });

    it("Validate a specific produc", () => {

        cy.visit("https://dev04/system/login/chemsofttest");
        cy.get('[name="user"]').click();
        cy.get('.username > .form-control').type("miljan");
        cy.get('.btn').contains('Sign in').click();
        cy.get('.nav-link').contains('List').click();
        cy.get('.tablinks').contains('Assembled').click();
        cy.get(".symbols").as('symbol');
        cy.get('@symbol').should('have.length', 21);
        cy.get('@symbol').find(".iconPx24").invoke('attr', 'title').should('include', 'Xi');

    });


});