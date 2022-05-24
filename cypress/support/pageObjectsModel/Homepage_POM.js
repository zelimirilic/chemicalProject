class Homepage_PO {
    visitHomepage() {
        cy.visit(Cypress.env("chemsoft_homepage"));
    }

    clickOnSignIn() {
        cy.get('[name="user"]').click();
        cy.get('.username > .form-control').type("miljan");
        cy.get('.btn').contains('Sign in').click();
    }

}

export default Homepage_PO;