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
    cy.contains('button', 'Start new ballot (demo-only)').should('not.exist')
    cy.get('iframe[title="SIV election results"]').should('not.exist')

    // Results open on demand, alongside the submitted-vote receipt, within the same step.
    cy.contains('button', /^View Results$/).click()
    cy.wait('@results')
    cy.contains('button', 'Verify results').find('span').first().should('have.class', 'bg-[#e6efe8]')
    cy.get('iframe[title="SIV voter interface"]').should('be.visible')
    cy.get('iframe[title="SIV election results"]').should('be.visible')
    cy.location('search').should('eq', '?verify-results')

    // Back uses the same voter receipt URL; Forward returns to results.
    cy.go('back')
    cy.location('search').should('eq', '?vote')
    cy.get('iframe[title="SIV voter interface"]').should(
      'have.attr',
      'src',
      '/election/demo-shared-v4-plurality/vote?auth=abcdef1234&demo=1',
    )
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
    cy.contains('button', 'Postal Mail').click()
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

// A replacement invitation must never expose the previous session while registration is pending or failed.
describe('Restart registration', () => {
  it('clears the old voter code and only enables the ballot after a successful retry', () => {
    cy.intercept('GET', '/election/demo-shared-v4-plurality/vote?*', '<html><body>Submitted ballot</body></html>')
    cy.visit('/demo?verify-results', {
      onBeforeLoad: (win) =>
        win.sessionStorage.setItem(
          'siv-shared-backend-demo-v5',
          JSON.stringify({
            session: { auth: 'abcdef1234', method: 'plurality', submitted: true },
            step: 'results',
          }),
        ),
    })
    cy.contains('button', 'Start again').click()
    cy.intercept('POST', '/api/demo/mint-auth-token', {
      body: { error: 'Registration unavailable' },
      delay: 1500,
      statusCode: 503,
    }).as('failedRegistration')
    cy.contains('button', /^Start$/).click()

    // While waiting, neither the old code nor its QR link is available.
    cy.contains('h1', 'Invitation').should('be.visible')
    cy.contains('abcdef1234').should('not.exist')
    cy.get('[aria-label="Open demo ballot from QR code"]').should('not.exist')
    cy.contains('button', 'Open ballot').should('be.disabled')
    cy.wait('@failedRegistration')
    cy.contains('Registration unavailable').should('be.visible')
    cy.contains('button', 'Open ballot').should('be.disabled')
    cy.contains('abcdef1234').should('not.exist')

    // A successful retry exposes only the replacement invitation.
    cy.intercept('POST', '/api/demo/mint-auth-token', { auth: '123456abcd' }).as('retryRegistration')
    cy.contains('button', 'Try again').click()
    cy.wait('@retryRegistration')
    cy.contains('button', 'Postal Mail').click()
    cy.get('[aria-label="Open demo ballot from QR code"]').should(
      'have.attr',
      'href',
      '/demo?vote&auth=123456abcd&method=plurality',
    )
    cy.contains('button', 'Open ballot').should('be.enabled').click()
    cy.get('iframe[title="SIV voter interface"]').should(
      'have.attr',
      'src',
      '/election/demo-shared-v4-plurality/vote?auth=123456abcd&demo=1',
    )
  })
})

// Starting a new ballot creates a fresh demo voter, preserving the receipt if registration fails.
describe('New demo ballot', () => {
  it('starts a fresh ballot from Vote and allows retry after failure', () => {
    cy.intercept('GET', '/election/demo-shared-v5-score/vote?*', '<html><body>Voter page</body></html>')
    cy.visit('/demo?vote', {
      onBeforeLoad: (win) =>
        win.sessionStorage.setItem(
          'siv-shared-backend-demo-v5',
          JSON.stringify({ session: { auth: 'abcdef1234', method: 'score', submitted: true }, step: 'vote' }),
        ),
    })
    cy.intercept('POST', '/api/demo/mint-auth-token', {
      body: { error: 'Registration unavailable' },
      statusCode: 503,
    })
    cy.contains('button', 'Start new ballot (demo-only)').click()
    cy.contains('Registration unavailable').should('be.visible')
    cy.get('iframe[title="SIV voter interface"]').should('have.attr', 'src').and('include', 'auth=abcdef1234')

    cy.intercept('POST', '/api/demo/mint-auth-token', { body: { auth: '123456abcd' }, delay: 300 }).as('recast')
    cy.contains('button', 'Start new ballot (demo-only)').click().should('be.disabled')
    cy.wait('@recast').its('request.body').should('deep.equal', { method: 'score' })
    cy.location('search').should('eq', '?vote')
    cy.contains('h1', 'Mark your ballot').should('be.visible')
    cy.get('iframe[title="SIV voter interface"]').should(
      'have.attr',
      'src',
      '/election/demo-shared-v5-score/vote?auth=123456abcd&demo=1',
    )
    cy.contains('button', 'Verify results').should('be.disabled')
    cy.contains('button', 'Start new ballot (demo-only)').should('not.exist')
  })
})

describe('Invitation method previews', () => {
  it('opens the demo ballot after simulated digital ID confirmation', () => {
    cy.intercept('POST', '/api/demo/mint-auth-token', { auth: 'abcdef1234' }).as('register')
    cy.intercept('GET', '/election/demo-shared-v4-plurality/vote?*', '<html><body>Demo ballot</body></html>')
    cy.visit('/demo', { onBeforeLoad: (win) => win.sessionStorage.clear() })
    cy.contains('button', /^Start$/).click()
    cy.wait('@register')
    cy.contains('button', 'Digital ID').click()
    cy.on('window:confirm', (message) => {
      expect(message).to.eq("For this demo, we'll take you right to the ballot.")
      return true
    })
    cy.contains('button', 'Continue with eID').click()
    cy.location('search').should('eq', '?vote')
  })

  it('keeps the assigned registration number after refresh and hides it for older sessions', () => {
    cy.intercept('POST', '/api/demo/mint-auth-token', { auth: 'abcdef1234', voterNumber: 42 }).as('register')
    cy.visit('/demo', { onBeforeLoad: (win) => win.sessionStorage.clear() })
    cy.contains('button', /^Start$/).click()
    cy.wait('@register')
    cy.contains('button', 'In Person').click()
    cy.get('[aria-label="Voter registration number"]').should('have.text', '42')
    cy.reload()
    cy.contains('button', 'In Person').click()
    cy.get('[aria-label="Voter registration number"]').should('have.text', '42')
    cy.window().then((win) => {
      const key = 'siv-shared-backend-demo-v5'
      const saved = JSON.parse(win.sessionStorage.getItem(key)!)
      delete saved.session.voterNumber
      win.sessionStorage.setItem(key, JSON.stringify(saved))
    })
    cy.reload()
    cy.contains('button', 'In Person').click()
    cy.get('[aria-label="Voter registration number"]').should('not.exist')
  })

  it('starts unselected, previews every method, and preserves ballot access on mobile', () => {
    cy.intercept('POST', '/api/demo/mint-auth-token', { auth: 'abcdef1234' }).as('register')
    cy.intercept('GET', '/election/demo-shared-v4-plurality/vote?*', '<html><body>Demo ballot</body></html>')
    cy.visit('/demo', { onBeforeLoad: (win) => win.sessionStorage.clear() })
    cy.contains('button', /^Start$/).click()
    cy.wait('@register')
    cy.get('[aria-controls="invitation-preview"]').should('have.length', 9)
    cy.contains('button', 'Other Methods').click()
    cy.get('#invitation-preview').within(() => {
      cy.contains('Provisional ballot process').should('be.visible')
      cy.contains('Passport Scan').should('be.visible')
      cy.contains('Virtual Poll').should('be.visible')
      cy.contains('SMS Verification').should('be.visible')
    })
    cy.contains('button', 'Other Methods').click()
    cy.contains('button', 'Existing Login Credentials').should('be.visible')
    cy.contains('button', 'Common Access Card').should('not.exist')
    cy.contains('button', 'Text message verification code').should('not.exist')
    cy.contains('button', 'Authenticator app code').should('not.exist')
    cy.get('[aria-controls="invitation-preview"][aria-pressed="true"]').should('not.exist')
    cy.get('#invitation-preview').should('not.exist')
    cy.contains('button', /^Email$/).click()
    cy.get('#invitation-preview').then(($preview) => {
      cy.contains('button', 'In Person').then(($nextRow) => {
        expect($preview[0].getBoundingClientRect().bottom).to.be.at.most($nextRow[0].getBoundingClientRect().top)
      })
    })
    cy.contains('button', /^Email$/)
      .click()
      .should('have.attr', 'aria-expanded', 'false')
    cy.get('#invitation-preview').should('not.exist')
    cy.get('[aria-controls="invitation-preview"]').each(($button) => {
      const label = $button.text().trim()
      cy.wrap($button).click().should('have.attr', 'aria-pressed', 'true')
      cy.get('#invitation-preview').should('have.attr', 'aria-label', `${label} example`)
      cy.get('[aria-controls="invitation-preview"][aria-pressed="true"]').should('have.length', 1)
    })
    cy.viewport(390, 844)
    cy.contains('button', /^Email$/).click()
    cy.get('#invitation-preview').then(($preview) => {
      cy.contains('button', /^Text Message$/).then(($nextRow) => {
        expect($preview[0].getBoundingClientRect().bottom).to.be.at.most($nextRow[0].getBoundingClientRect().top)
      })
    })
    cy.get('iframe[title="SIV invitation email"]')
      .its('0.contentDocument.body')
      .should('contain', 'Vote Invitation: City Mayoral Election')
    cy.document().then((doc) => expect(doc.documentElement.scrollWidth).to.be.at.most(390))
    cy.contains('button', /^Text Message$/).click()
    cy.get('#invitation-preview').should('contain', 'Text Message · Today 9:00 AM')
    cy.get('#invitation-preview a').should('have.attr', 'href').and('contain', 'auth=abcdef1234')
    cy.document().then((doc) => expect(doc.documentElement.scrollWidth).to.be.at.most(390))
    cy.contains('button', 'Drawn Signature').click()
    cy.get('iframe[title="SIV signature screen"]')
      .its('0.contentDocument.body')
      .should('contain', 'Add Your Signature')
      .then(cy.wrap)
      .as('signatureBody')
      .find('a')
      .contains('Submit')
      .should('have.class', 'disabled')
      .click()
    cy.get('#invitation-preview').should('exist')
    cy.get('@signatureBody').find('canvas')
      .trigger('pointerdown', 30, 30, { button: 0, pointerId: 1 })
      .trigger('pointermove', 90, 70, { button: 0, pointerId: 1 })
      .trigger('pointerup', 90, 70, { button: 0, pointerId: 1 })
    cy.get('@signatureBody').contains('a', 'Submit').should('not.have.class', 'disabled')
    cy.get('@signatureBody').contains('a', 'Clear').click()
    cy.get('@signatureBody').contains('a', 'Submit').should('have.class', 'disabled')
    cy.get('@signatureBody').find('canvas')
      .trigger('pointerdown', 30, 30, { button: 0, pointerId: 1 })
      .trigger('pointermove', 90, 70, { button: 0, pointerId: 1 })
      .trigger('pointerup', 90, 70, { button: 0, pointerId: 1 })
    cy.get('@signatureBody').contains('a', 'Submit').should('not.have.class', 'disabled').click()
    cy.get('#invitation-preview').should('not.exist')
    cy.location('search').should('eq', '?invite')
    cy.contains('button', 'Drawn Signature').click()
    cy.get('iframe[title="SIV signature screen"]')
      .its('0.contentDocument.body')
      .should('contain', 'Add Your Signature')
      .then(cy.wrap)
      .contains('a', 'Submit')
      .should('not.have.class', 'disabled')
      .click()
    cy.get('#invitation-preview').should('not.exist')
    cy.contains('button', /^Email$/).click()
    cy.get('iframe[title="SIV invitation email"]')
      .its('0.contentDocument.body')
      .should('contain', 'Vote Invitation')
      .then(cy.wrap)
      .find('a')
      .should('have.attr', 'target', '_top')
    cy.get('iframe[title="SIV invitation email"]')
      .its('0.contentDocument.body')
      .then(cy.wrap)
      .find('a')
      .should('have.text', 'local.gov/vote?auth=abcdef1234')
      .click()
    cy.location('search').should('eq', '?vote')
    cy.contains('h1', 'Mark your ballot').should('be.visible')
    cy.get('iframe[title="SIV invitation email"]').should('not.exist')
  })
})
