/*

-[x] / admin
    - [x] /${election_id}/ sub-pages:
    - [ ] /ballot
    - [ ] /observers
    - [ ] /voters
  - [ ] /vote -> EnterAuth
  - [ ] /vote w/ Auth
  - [ ] /${election_id}/ Status page
  - [ ] /observer/keygen
  - [ ] /observer/shuffle
*/

describe('Can create an election', () => {
  it('Can log into /admin w/ jwt cookie', () => {
    cy.setCookie('siv-jwt', Cypress.env('E2E_TESTER_ADMIN_JWT'))
    cy.visit('/admin').contains('Your Existing Elections:')
  })

  it('Can create new election', () => {
    cy.setCookie('siv-jwt', Cypress.env('E2E_TESTER_ADMIN_JWT'))
    cy.visit('/admin')

    cy.get('#election-title').type('test election')
    cy.get('#election-title-save').click()

    cy.contains('Managing: test election')
  })
})
