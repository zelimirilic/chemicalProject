
export function visitHomepage() {
    cy.visit(Cypress.env("chemsoft_homepage"));
}

export function clickOnSignIn() {
    cy.get('[name="user"]').click();
    cy.get('.username > .form-control').type("userdev");
    cy.get('.password > .form-control').type("hirsl666");
    cy.get('.btn').contains('Sign in').click();
}



