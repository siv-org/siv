/*
Tests:

- [ ] Can load pages without rendering error:
  - [x] /
  - [x] /protocol
  - [x] /about
  - [x] /faq
  - [x] /login
  - [x] /admin
  - [ ] /${election_id}/ sub-pages:
  - [ ] /ballot
  - [ ] /observers
  - [ ] /voters
  - [ ] /vote -> EnterAuth
  - [ ] /vote w/ Auth
  - [ ] /${election_id}/ Status page
  - [ ] /observer/keygen
  - [ ] /observer/shuffle
*/

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

  it('/admin', () => {
    cy.setCookie('siv-jwt', Cypress.env('E2E_TESTER_ADMIN_JWT'))
    cy.visit('/admin').contains('Your Existing Elections:')
  })
})
