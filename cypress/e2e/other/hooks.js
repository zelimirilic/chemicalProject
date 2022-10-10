

describe('hooks', function () {
    before(function () {
        // runs once before the first test in this block
        cy.log("runs once before the first test in this block")
    });

    after(function () {
        // runs once after the last test in this block
        cy.log("runs once after the last test in this block")
    });

    beforeEach(function () {
        // runs before each test in this block
        cy.log("runs before each test in this block")
    });

    afterEach(function () {
        // runs after each test in this block
        cy.log("runs after each test in this block")
    });

    // test cases
    it("Test One", () => {
        cy.log("Example One")
    })
    it("Test Two", () => {
        cy.log("Example Two")
    })
});