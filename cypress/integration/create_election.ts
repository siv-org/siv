/*

-[x] / admin
    - [x] /${election_id}/ sub-pages:
    - [x] /ballot
    - [ ] /observers
    - [ ] /voters
  - [ ] /vote -> EnterAuth
  - [ ] /vote w/ Auth
  - [ ] /${election_id}/ Status page
  - [ ] /observer/keygen
  - [ ] /observer/shuffle
*/

let election_id = ''

describe('Can create an election', () => {
  beforeEach(() => {
    cy.setCookie('siv-jwt', Cypress.env('E2E_TESTER_ADMIN_JWT'))
  })

  it('Can log into /admin w/ jwt cookie', () => {
    cy.visit('/admin').contains('Your Existing Elections:')
  })

  it('Can create new election', { defaultCommandTimeout: 10_000 }, () => {
    cy.get('#election-title').type('test election')
    cy.get('#election-title-save').click()

    cy.contains('Managing: test election')

    // Save election_id
    cy.get('.current-election > span')
      .invoke('text')
      .then((text) => {
        election_id = text.trim().slice(4)
      })
  })

  it('Can edit ballot design in Wizard Mode', () => {
    cy.get('.title-input').type('abc')
  })

  it('Can edit ballot design in Text Mode', () => {
    // Switch to text mode
    cy.get('.mode-controls > :nth-child(2)').click()

    // Modify 'Bill Clinton' line
    cy.get(':nth-child(10) > .CodeMirror-line > [role="presentation"] > :nth-child(2)').type('FOO')

    // Check if change is reflected in Wizard mode
    cy.get('.mode-controls > :nth-child(1)').click()
    cy.get(':nth-child(2) > .name-input').should('have.value', 'Bill CFOOlinton')
  })

  it('Delete test election at the end to cleanup', () => {
    cy.request(`api/election/${election_id}/delete-test-election`).then((response) => {
      expect(response.status).to.eq(201)
    })
  })
})
