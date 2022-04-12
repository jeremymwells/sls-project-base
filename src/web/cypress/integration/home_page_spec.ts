
describe('The Home Page', () => {

    it('successfully loads', () => {
        cy.visit('/', { timeout: 240000, retryOnNetworkFailure: true, retryOnStatusCodeFailure: true });
    });



});
