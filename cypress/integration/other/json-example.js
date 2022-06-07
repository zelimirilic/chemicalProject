/// <reference types="Cypress" />

describe('JSON object', () => {
    it('JSON object example', () => {
        const exampleObject = { "key": "Toma", "key2": "Zdravko" }
        const exampleArraayOfValues = ["Sara", "Mara", "Jovana"]

        const users = {
            "firstName": "Joe",
            "lastName": "Blogs",
            "Age": 30,
            "Students": [
                {
                    "firstName": "Jim",
                    "lastName": "Blogs2",
                },
                {
                    "firstName": "Sarah",
                    "lastName": "Parker",
                }
            ]
        }

        cy.log(exampleObject["key"]);
        cy.log(exampleObject.key2);
        cy.log(exampleArraayOfValues[0]);
        cy.log(exampleArraayOfValues[1]);
        cy.log(exampleArraayOfValues[2]);
        cy.log(users.Students[1].lastName).log(users.Students[1].firstName);
    })
})