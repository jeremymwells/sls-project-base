
const baseUrl = Cypress.env('PUBLIC_URL');
const apiPrefix = Cypress.env('API_PREFIX');
const apiEndpoint = `${baseUrl}/${apiPrefix}`;


describe('The Home Page', async () => {
    
    const message='foobarbaz';
    describe('The Home Page', async () => {
        it('successfully loads', () => {
            cy.request(`${apiEndpoint}/app?message=${message}`).as('apiMessage');
            cy.get('@apiMessage').then((response: any) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.include(message);
                assert.strictEqual(response.body, message);
            });
        });
    });
})