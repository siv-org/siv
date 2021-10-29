describe('The webapp should render', () => {
  it('homepage', () => {
    cy.visit('/').contains('Fast. Private. Verifiable')
  })
})
