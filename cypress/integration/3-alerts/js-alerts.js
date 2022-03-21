/// <reference types="Cypress" />


describe("Handle JS alerts", () => {
    it("Confirm JS alerts contains the correct text", () => {

        cy.visit("https://dev04/system/login/chemsofttest/?name=miljan&password=hirsl666");
        cy.get('.nav-link').contains('Tools').click({ force: true });
        cy.get('[href="/system/chemicals/risk_assessment/risks"]').click();
        cy.get(':nth-child(2) > td.prodName > a').click();

        cy.get('.tablinks').contains('Handling').click();
        cy.xpath('//html/body/div[1]/div/main/div/div/div[2]/div/div[2]/div[2]/div[1]/div[1]/div/div/input').click({ force: true }).type('sdsd');
        cy.get('.mainMenu > :nth-child(2) > .nav-link').click();

        cy.get('.card > .card-body > h6').eq(1).should('have.text', 'You have unsaved data. Are you sure you want to proceed?');
    });

    it("Validate confirm alert box works correctly when user clicks OK", () => {

        cy.visit("https://dev04/system/login/chemsofttest/?name=miljan&password=hirsl666");
        cy.get('.nav-link').contains('Tools').click();
        cy.get('[href="/system/chemicals/risk_assessment/risks"]').click();
        cy.get(':nth-child(11) > td.prodName > a').click();

        cy.get('.tablinks').contains('Risk evaluation and actions').click();
        cy.get('.col-2 > :nth-child(1) > .dateInp > .mx-input-wrapper > .mx-input').eq(0).click();
        cy.get('.col-2 > :nth-child(1) > .dateInp > .mx-input-wrapper > .mx-input').click();
        cy.get('.cell').eq(7).should('have.attr', 'data-row-col', '1,0').click();
        cy.get('.nav-link').contains('List').click();
        cy.get('.card > .card-body > h6').eq(1).should('have.text', 'You have unsaved data. Are you sure you want to proceed?');
        cy.get(':nth-child(8) > .modalCard > .card > .card-body > .pt-4 > [title="OK"]').click();

        // cy.on('window:alert', (str) => {
        //     expect(str).to.equal('You have unsaved data. Are you sure you want to proceed?')
        // })
        cy.url().should('include', 'chemical_list/department');

    });

    it("Validate confirm alert box works correctly when user clicks Cancel", () => {

        cy.visit("https://dev04/system/login/chemsofttest/?name=miljan&password=hirsl666");
        cy.get('.nav-link').contains('Tools').click();
        cy.get('[href="/system/chemicals/risk_assessment/risks"]').click();
        cy.get(':nth-child(11) > td.prodName > a').click();

        cy.get('.tablinks').contains('Risk evaluation and actions').click();
        cy.get('.col-2 > :nth-child(1) > .dateInp > .mx-input-wrapper > .mx-input').eq(0).click();
        cy.get('.col-2 > :nth-child(1) > .dateInp > .mx-input-wrapper > .mx-input').click();
        cy.get('.cell').eq(7).should('have.attr', 'data-row-col', '1,0').click();
        cy.get('.nav-link').contains('List').click();
        cy.get('.card > .card-body > h6').eq(1).should('have.text', 'You have unsaved data. Are you sure you want to proceed?');
        cy.get(':nth-child(8) > .modalCard > .card > .card-body > .pt-4 > [title="Cancel"]').click();

        // cy.on('window:confirm', () => {
        //     return true;
        // })
        cy.url().should('include', 'evaluation');

    });
});

