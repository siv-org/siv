/// <reference types="cypress-mailslurp" />

import { MatchOptionFieldEnum, MatchOptionShouldEnum } from 'mailslurp-client'
/*

-[x] / admin
    - [x] /${election_id}/ sub-pages:
    - [x] /ballot
    - [x] /observers
    - [x] /observer/keygen
    - [x] /voters
  - [x] /vote -> EnterAuth
  - [x] /vote w/ Auth
  - [x] /${election_id}/ Status page
  - [x] /observer/shuffle
  - [x] /${election_id} status page has votes
*/

// Pick a random election name
const election_name = 'test ' + String(Math.random()).slice(2, 10)

// Initializing now so we can re-use between tests
let election_id = ''
let observer_auth = ''
const voter_auth_tokens = []
const votes = []

// 15 second timeout
Cypress.config('defaultCommandTimeout', 15_000)

describe('Can create an election', () => {
  beforeEach(() => {
    cy.setCookie('siv-jwt', Cypress.env('E2E_TESTER_ADMIN_JWT'))
  })

  it('Can log into /admin w/ jwt cookie', { retries: 3 }, () => {
    cy.visit('/admin')
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.contains('Your Existing Elections:')
  })

  it('Can create new election', () => {
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
    cy.contains('Verifying Observers').should('exist')

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

  it('Can receive Observer invitation email', () => {
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
          timeout: 30_000,
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
      .contains('Which ✅ matches plaintext.')

    // Return to admin UI
    cy.visit(`/admin/${election_id}/observers`)
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.contains('✅ The Verifying Observers completed the Pre-Election setup.')

    // Save the observer's new private key, for later decryption
    cy.saveLocalStorage()

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

  it('voters can cast votes', () => {
    // For each voter auth token:
    cy.wrap(voter_auth_tokens).each((token: string) => {
      // Visit 'Cast Vote' page
      cy.visit(`/election/${election_id}/vote`)

      // Expect auth input to be selected
      cy.get('input')
        .should('have.focus')

        // Enter voter token
        .type(token)

        // Hit Enter
        .type('{enter}')

      // Confirm it was accepted
      cy.contains('Your Voter Authorization Token is valid.').should('exist')

      // Pick a vote option
      // OR
      // Write a write-in
      let vote = ''

      const will_write_in = Math.random() > 0.5
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
        votes.push(vote)
      })

      // Submit vote
      cy.contains('a', 'Submit').click()

      // Confirm we were redirected to Submission page
      cy.contains('Submitted').should('exist')

      // Visit election status page, confirm row w/ voter auth token is present
      cy.visit(`/election/${election_id}`).contains(token).should('exist')
    })

    // Return to election admin page,
    cy.visit(`/admin/${election_id}/voters`)
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting

    // Confirm both Voter rows are marked as voted
    cy.get('#main-content table > tbody > tr')
      .should('have.length', 2)
      .each((row) => cy.wrap(row).contains('✓').should('exist'))
  })

  it('Admin can begin unlocking votes', () => {
    // Find and click Unlock button
    cy.contains('a', 'Unlock 2 Votes').should('exist').click()

    // Expect "Waiting on message"
    cy.contains('Unlocking: Waiting on Observer').should('exist')
  })

  it('Observers can shuffle', () => {
    // Restore observer's local storage snapshot from keygen
    cy.restoreLocalStorage()

    // Open observer tab,
    cy.visit(`/election/${election_id}/observer?auth=${observer_auth}`)

    // Wait for top bar to fully render
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting

    // Switch to Shuffle tab
    cy.contains('After Election').should('exist').click()

    // Wait for shuffle & decryption to complete
    cy.wait(5000) // eslint-disable-line cypress/no-unnecessary-waiting

    // Expect at least one of the 2 sets of 2 decryption proofs to be verified.
    cy.contains('2 of 2 Decryption Proofs verified').should('exist')
  })

  it('Final results published', () => {
    // election_id = '1637366404267'
    cy.visit(`/election/${election_id}`)

    // Expect 'Vote Totals' section to be present
    cy.contains('Vote Totals:').should('exist')

    // Expect our 2 votes to be present
    cy.wrap(votes).each((vote: string) => {
      cy.contains(vote).should('exist')
    })
  })

  it('Delete test election at the end to cleanup', () => {
    // cy.pause()
    cy.request(`api/election/${election_id}/delete-test-election`).then((response) => {
      expect(response.status).to.eq(201)
    })
  })
})
