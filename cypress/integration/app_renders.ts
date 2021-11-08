describe('The webapp should render', () => {
  it('/', () => {
    cy.visit('/').contains('Fast. Private. Verifiable')
  })

  it('/protocol', () => {
    cy.visit('/protocol').contains('Secure Internet Voting (SIV) Protocol Overview')
  })

  it('/about', () => {
    cy.visit('/about').contains('Decentralized Threshold Key Generation & Decryption')
  })

  it('/faq', () => {
    cy.visit('/faq').contains('Frequently Asked Questions')
  })

  it('/login', () => {
    cy.visit('/login').contains('Create an account')
  })
})
