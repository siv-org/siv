// Run: npx cypress run --config-file cypress/cypress-config.json --spec cypress/integration/demo_navigation.ts
// Checks demo navigation (Back, Forward, refresh), progress indicators and restart,
// the submitted-vote/results layout on desktop and mobile.
describe('Demo browser navigation', () => {
  it('keeps the URL, Back, Forward, and refresh in sync with the current step', () => {
    // Stub registration and the ballot so this test only exercises the demo shell.
    cy.intercept('POST', '/api/demo/mint-auth-token', { auth: 'abcdef1234' }).as('register')
    cy.intercept('GET', '/election/demo-shared-v4-plurality/vote?*', '<html><body>Demo ballot</body></html>')
    cy.visit('/demo', { onBeforeLoad: (win) => win.sessionStorage.clear() })

    // Start a fresh session and check that current and completed steps are filled.
    cy.contains('button', /^Start$/).click()
    cy.wait('@register')
    cy.location('search').should('eq', '?invite')
    cy.contains('button', 'Start demo').find('span').first().should('have.class', 'bg-[#e6efe8]')
    cy.contains('button', 'Receive invite').should('have.attr', 'aria-current', 'step')
    cy.contains('button', 'Receive invite').find('span').first().should('have.class', 'bg-[#e6efe8]')
    cy.contains('button', 'Open ballot').click()
    cy.location('search').should('eq', '?vote')
    cy.contains('button', 'Receive invite').find('span').first().should('have.class', 'bg-[#e6efe8]')

    // Browser history must restore both the URL and the visible step.
    cy.go('back')
    cy.contains('h1', 'Invitation').should('be.visible')
    cy.location('search').should('eq', '?invite')
    cy.go('back')
    cy.contains('h1', 'SIV Demo').should('be.visible')
    cy.go('forward')
    cy.contains('h1', 'Invitation').should('be.visible')
    cy.go('forward')
    cy.contains('h1', 'Mark your ballot').should('be.visible')

    // Refresh keeps the session; clicking a step also creates a Back-button stop.
    cy.reload()
    cy.contains('h1', 'Mark your ballot').should('be.visible')
    cy.location('search').should('eq', '?vote')
    cy.contains('button', 'Receive invite').click()
    cy.location('search').should('eq', '?invite')
    cy.go('back')
    cy.contains('h1', 'Mark your ballot').should('be.visible')
  })
})

// The real voter page reports submission through the same frame message used here.
describe('Verify Results layout', () => {
  it('keeps both pages in step 3 and goes directly back to the ballot', () => {
    // Use desktop dimensions and stub the backend responses and iframe pages.
    cy.viewport(1280, 900)
    cy.intercept('POST', '/api/demo/mint-auth-token', { auth: 'abcdef1234' })
    cy.intercept('POST', '/api/demo/demo-shared-v4-plurality/unlock-results', {}).as('results')
    cy.intercept('GET', '/election/demo-shared-v4-plurality', '<html><body><h1>Election Results</h1></body></html>')
    cy.intercept(
      'GET',
      '/election/demo-shared-v4-plurality/vote?*',
      `
      <html><body><h1>Demo ballot</h1><button onclick="window.parent.postMessage({channel:'siv-backend-demo',election_id:'demo-shared-v4-plurality',type:'submitted'},window.location.origin)">Submit demo vote</button></body></html>
    `,
    )
    cy.visit('/demo', { onBeforeLoad: (win) => win.sessionStorage.clear() })
    cy.contains('button', /^Start$/).click()
    cy.contains('button', 'Open ballot').click()

    // Submit inside the iframe; its message should move the parent to Verify Results.
    cy.get('iframe[title="SIV voter interface"]')
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then((body) => {
        cy.wrap(body).contains('button', 'Submit demo vote').click()
      })
    cy.location('search').should('eq', '?verify-results')
    cy.contains('button', 'Verify results').should('have.attr', 'aria-current', 'step')
    cy.contains('h2', 'Your submitted vote').should('be.visible')
    cy.get('iframe[title="SIV election results"]').should('not.exist')

    // Results open on demand, alongside the submitted-vote receipt, within the same step.
    cy.contains('button', /^View Results$/).click()
    cy.wait('@results')
    cy.contains('button', 'Verify results').find('span').first().should('have.class', 'bg-[#e6efe8]')
    cy.get('iframe[title="SIV voter interface"]').should('be.visible')
    cy.get('iframe[title="SIV election results"]').should('be.visible')
    cy.location('search').should('eq', '?verify-results')

    // Back shows the submitted ballot in review mode; Forward returns to results.
    cy.go('back')
    cy.location('search').should('eq', '?vote')
    cy.get('iframe[title="SIV voter interface"]').should('have.attr', 'src').and('include', 'view=ballot')
    cy.go('forward')
    cy.location('search').should('eq', '?verify-results')

    // On mobile, both sections remain available and the return link stays on this step.
    cy.viewport(390, 844)
    cy.reload()
    cy.contains('button', /^View Results$/).click()
    cy.wait('@results')
    cy.contains('h2', 'Election results').should('be.visible')
    cy.contains('button', 'Back to your vote ↑').click()
    cy.contains('h2', 'Your submitted vote').should('be.visible')
    cy.location('search').should('eq', '?verify-results')

    // Restart must clear the later progress circles, even after results were opened.
    cy.contains('button', 'Start again').click()
    cy.location('search').should('eq', '?intro')
    cy.contains('button', 'Start demo').find('span').first().should('have.class', 'bg-[#e6efe8]')
    for (const label of ['Receive invite', 'Vote', 'Verify results']) {
      cy.contains('ol button', label).find('span').first().should('have.class', 'bg-h26-bg')
    }
  })
})

// Following the QR destination on a fresh device must retain the invitation's voter code.
describe('Scanned demo invitation', () => {
  it('opens the matching ballot without an existing session and survives refresh', () => {
    cy.intercept('POST', '/api/demo/mint-auth-token', { auth: 'abcdef1234' }).as('register')
    cy.intercept('GET', '/election/demo-shared-v4-plurality/vote?*', '<html><body>Demo ballot</body></html>')
    cy.visit('/demo', { onBeforeLoad: (win) => win.sessionStorage.clear() })
    cy.contains('button', /^Start$/).click()
    cy.wait('@register')
    cy.get('[aria-label="Open demo ballot from QR code"]')
      .should('have.attr', 'href', '/demo?vote&auth=abcdef1234&method=plurality')
      .invoke('attr', 'href')
      .then((href) => {
        cy.visit(String(href), { onBeforeLoad: (win) => win.sessionStorage.clear() })
      })
    cy.contains('h1', 'Mark your ballot').should('be.visible')
    cy.location('search').should('eq', '?vote')
    cy.get('iframe[title="SIV voter interface"]').should(
      'have.attr',
      'src',
      '/election/demo-shared-v4-plurality/vote?auth=abcdef1234&demo=1',
    )
    cy.reload()
    cy.contains('h1', 'Mark your ballot').should('be.visible')
    cy.get('iframe[title="SIV voter interface"]').should(
      'have.attr',
      'src',
      '/election/demo-shared-v4-plurality/vote?auth=abcdef1234&demo=1',
    )
  })

  it('uses the scanned method instead of an older saved session and rejects invalid invitations', () => {
    cy.intercept('GET', '/election/demo-shared-v5-score/vote?*', '<html><body>Score ballot</body></html>')
    cy.visit('/demo?vote&auth=123456abcd&method=score', {
      onBeforeLoad: (win) =>
        win.sessionStorage.setItem(
          'siv-shared-backend-demo-v5',
          JSON.stringify({
            session: { auth: 'abcdef1234', method: 'plurality' },
            step: 'invite',
          }),
        ),
    })
    cy.get('iframe[title="SIV voter interface"]').should(
      'have.attr',
      'src',
      '/election/demo-shared-v5-score/vote?auth=123456abcd&demo=1',
    )
    for (const query of ['auth=invalid&method=score', 'auth=123456abcd&method=unknown']) {
      cy.visit(`/demo?vote&${query}`, { onBeforeLoad: (win) => win.sessionStorage.clear() })
      cy.contains('h1', 'SIV Demo').should('be.visible')
      cy.get('iframe[title="SIV voter interface"]').should('not.exist')
    }
  })
})
