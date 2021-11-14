/// <reference types="cypress-mailslurp" />

import { MatchOptionFieldEnum, MatchOptionShouldEnum } from 'mailslurp-client'
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

// Pick a random election name
let election_name = 'test ' + String(Math.random()).slice(2, 10)

// Initializing now so we can re-use between tests
let election_id = ''
let observer_auth = ''
const voter_auth_tokens = []
const votes = []

describe('Can create an election', () => {
  beforeEach(() => {
    cy.setCookie('siv-jwt', Cypress.env('E2E_TESTER_ADMIN_JWT'))
  })

  it('Can log into /admin w/ jwt cookie', { retries: 3 }, () => {
    cy.visit('/admin')
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.contains('Your Existing Elections:')
  })

  it('Can create new election', { defaultCommandTimeout: 10_000 }, () => {
    cy.get('#election-title').type(election_name)
    cy.get('#election-title-save').click()

    cy.contains(`Managing: ${election_name}`)

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

  it('Can finalize ballot design', () => {
    // Locate & click the finalize button
    cy.contains('Finalize').click()

    // Expect to switch to observer tab
    cy.contains('Verifying Observers')

    // Expect the ballot design checkbox in the sidebar to be 'checked'
    cy.get('.sidebar input[type="checkbox"]').first().should('be.checked')
  })

  it.skip('Can skip adding observers')

  const mailslurp_address = '1401ca7a-7e21-4ce6-b1ca-0188b65f81ea@mailslurp.com'
  it('Can add extra Observers for keygen', () => {
    // Add an email address
    cy.get('input[type="text"]').first().type(mailslurp_address)

    // Click invite button
    cy.contains('Finalize & Send Invitation').click()
  })

  it('Can receive Observer invitation email', { defaultCommandTimeout: 30000 }, () => {
    const inboxId = mailslurp_address.split('@')[0]

    // Look for email invitation
    cy.mailslurp()
      .then((mailslurp) =>
        mailslurp.waitController.waitForMatchingFirstEmail({
          inboxId,
          matchOptions: {
            matches: [
              {
                field: MatchOptionFieldEnum.SUBJECT,
                should: MatchOptionShouldEnum.CONTAIN,
                value: election_name,
              },
            ],
          },
          timeout: 30000,
        }),
      )
      .then((email) => {
        // Was email found?
        expect(email).to.exist

        // Extract observer's auth token
        const match = email.body.match(/\?auth=[a-f0-9]{10}/)[0]
        observer_auth = match.split('=')[1]

        // Could we find a 10 char auth token?
        expect(observer_auth).to.exist.and.lengthOf(10)
      })
  })

  it('Can run observer keygen process', () => {
    // Open observer tab,
    cy.visit(`/election/${election_id}/observer?auth=${observer_auth}`)

      //look for success message
      .contains('Which ✅ matches plaintext.', {
        timeout: 15000,
      })

    // Return to admin UI
    cy.visit(`/admin/${election_id}/observers`)
    cy.wait(500) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.contains('✅ The Verifying Observers completed the Pre-Election setup.')

    // Expect the observer checkbox in the sidebar to be 'checked'
    cy.get('.sidebar input[type="checkbox"]').eq(1).should('be.checked')
  })

  it('Can add voters', () => {
    // Switch to voter tab
    cy.get('.sidebar').contains('Voters').click()

    // Input should be auto-focused
    cy.focused()
      .should('have.attr', 'id', 'textarea')
      // Add 2 voters
      .type('test1@siv.tech{enter}test2@siv.tech')

    // Hit Save button
    cy.get('#main-content').contains('Save').click()

    // Expect table to have added 2 voters
    cy.get('#main-content table > tbody > tr').should('have.length', 2)

    // We'll extract the voter auth tokens directly, rather than sending emails

    // First we need to unmask them
    cy.contains('auth token').click()

    // Then we can extract the auth tokens
    cy.get('#main-content table > tbody > tr > td:nth-child(4)')
      .each(($el) => voter_auth_tokens.push($el.text()))
      .then(() => {
        expect(voter_auth_tokens).to.have.length(2)
        cy.log('Found vote tokens: ' + voter_auth_tokens)
      })
  })

  it.only('voters can cast votes', () => {
    election_id = '1636866461910'
    election_name = 'test 85211298'
    voter_auth_tokens.push('113f88ff9e', 'f74ea617c9')

    // For each voter auth token:
    cy.wrap(voter_auth_tokens).each((token) => {
      // Visit 'Cast Vote' page
      cy.visit(`/election/${election_id}/vote`)

      // Expect auth input to be selected
      cy.get('input')
        .should('have.focus')

        // Enter voter token
        .type(token as unknown as string)

        // Hit Enter
        .type('{enter}')

      // Confirm it was accepted
      cy.contains('Your Voter Authorization Token is valid.')

      // Pick a vote option
      // OR
      // Write a write-in
      let vote = ''

      const will_write_in = Math.random() > 0.9
      if (will_write_in) {
        vote = (Math.random() + 1).toString(36).substring(7)
        cy.get('#president-other').type(vote)
      } else {
        const choice = Math.floor(Math.random() * 3)
        cy.get('input[type="radio"]')
          .eq(choice)
          .then(($el) => {
            // Store our selection for later
            vote = $el.val() as string
            return $el
          })
          .click()
      }

      cy.then(() => {
        cy.log(`voting for: ${vote}`)
      })

      // Submit vote

      // Confirm we were redirected to Submission page

      // Visit election status page, confirm row w/ voter auth token is present
    })

    // Return to election admin page, confirm both rows are marked as voted
  })

  it('Delete test election at the end to cleanup', () => {
    // cy.pause()
    cy.request(`api/election/${election_id}/delete-test-election`).then((response) => {
      expect(response.status).to.eq(201)
    })
  })
})
