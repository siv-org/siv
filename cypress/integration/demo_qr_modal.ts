/* global cy, expect, it */
// Run with: npm run e2e -- --browser electron --spec cypress/integration/demo_qr_modal.ts
it(
  'keeps the embedded receipt height stable and its enlarged QR inside the voter window',
  { waitForAnimations: false },
  () => {
    cy.viewport(1280, 800)
    cy.intercept('GET', '/api/election/demo-shared-v4-plurality/info', { ballot_design: [] })
    cy.intercept('POST', '**/demo-shared-v4-plurality/was-vote-invalidated*', { body: false })
    cy.intercept('POST', '**/malware-check/init', { otp: '123456' })
    cy.visit('/demo', {
      onBeforeLoad(win) {
        win.sessionStorage.clear()
        win.localStorage.setItem(
          'voter-demo-shared-v4-plurality-abcdef1234',
          JSON.stringify({
            ballot_design: [],
            encrypted: {},
            plaintext: {},
            randomizer: { vote: '1' },
            submitted_at: '2026-10-29',
            tracking: '1234-1234-1234',
          }),
        )
      },
    })
    cy.location('search', { timeout: 60_000 }).should('eq', '?intro')
    cy.window().then((win) => {
      win.sessionStorage.setItem(
        'siv-shared-backend-demo-v5',
        JSON.stringify({ session: { auth: 'abcdef1234', method: 'plurality', submitted: true }, step: 'results' }),
      )
    })
    cy.visit('/demo?verify-results')
    cy.location('search', { timeout: 20_000 }).should('eq', '?verify-results')
    cy.get('iframe[title="SIV voter interface"]', { timeout: 20_000 }).as('receipt')
    cy.get('@receipt')
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then((body) => {
        cy.wrap(body).contains('a', 'changed by malware').click()
        cy.wrap(body).contains('button', 'Check with another device').click()
        cy.wrap(body).contains('Tap for fullscreen').click()
      })
    cy.get('[role="dialog"]').should('not.exist')
    cy.get('@receipt')
      .its('0.contentDocument.body')
      .find('[role="dialog"]')
      .should('be.visible')
      .then(($dialog) => {
        const rect = $dialog[0].getBoundingClientRect()
        expect(rect.top).to.equal(0)
        const win = $dialog[0].ownerDocument.defaultView
        expect(rect.width).to.equal(win.innerWidth)
        expect(rect.height).to.equal(win.innerHeight)
      })
    cy.get('@receipt').its('0.contentDocument.body').find('[role="dialog"] canvas').should('be.visible')
    cy.get('@receipt').should(($frame) => {
      const frame = $frame[0] as HTMLIFrameElement
      const qr = frame.contentDocument.querySelector('[role="dialog"] canvas').getBoundingClientRect()
      const bounds = frame.getBoundingClientRect()
      expect(bounds.top + qr.top).to.be.at.least(0)
      expect(bounds.top + qr.bottom).to.be.at.most(800)
      expect(qr.left).to.be.at.least(0)
      expect(qr.right).to.be.at.most(bounds.width)
    })
    cy.get('@receipt').its('0.contentDocument.body').find('button[aria-label="Close modal"]').click()
    cy.get('@receipt').its('0.contentDocument.body').find('[role="dialog"]').should('not.exist')
    cy.get('@receipt').then(($frame) => {
      const frame = $frame[0] as HTMLIFrameElement
      // The receipt must fit its contents without creating an inner scrollbar.
      cy.wrap(frame.contentDocument.documentElement).should((html) => {
        expect(html.scrollHeight).to.equal(html.clientHeight)
      })
    })
    cy.get('@receipt').then(($frame) => {
      const height = $frame[0].getBoundingClientRect().height
      expect(height).to.be.lessThan(2_000)
      // Give ResizeObserver multiple frames to expose a height-feedback loop.
      cy.wait(500)
      cy.get('@receipt').should(($sameFrame) => {
        expect($sameFrame[0].getBoundingClientRect().height).to.equal(height)
      })
    })
  },
)
