// Run: bun run e2e --spec cypress/integration/budget_amounts.ts
// Exercises the real budget input, remaining totals, cursor position, and clearing an allocation.
describe('Budget ballot amounts', () => {
  it('formats amounts while editing and stores comma-free values', () => {
    // Load the real voter interface with a small, predictable budget ballot. No vote is submitted.
    cy.intercept('GET', '/api/election/budget-formatting-test/info', {
      ballot_design: [
        {
          budget_available: 100000,
          id: 'vote',
          options: [{ name: 'Proposal A' }],
          title: 'Community budget',
          type: 'budget',
          write_in_allowed: false,
        },
      ],
      ballot_design_finalized: true,
      threshold_public_key: 'e2f2ae0a6abc4e71a884a961c500515f58e30b6aa582dd8db6a65945e08d2d76',
    })
    cy.visit('/election/budget-formatting-test/vote?auth=abcdef1234', {
      onBeforeLoad: (win) => win.localStorage.clear(),
    })
    cy.get('[aria-label="Amount for Proposal A"]').as('amount')

    // Commas are display-only: decimals and the remaining-budget calculation still work.
    cy.get('@amount').type('12345.67').should('have.value', '12,345.67')
    cy.contains('Budget Available: $87,654.33 of $100,000').should('be.visible')

    // Inserting a digit near the start must not jump the cursor to the end.
    cy.get('@amount').type('{home}{rightArrow}9').should('have.value', '192,345.67')
    cy.get('@amount').should(($input) => expect(($input[0] as HTMLInputElement).selectionStart).to.eq(2))

    // Clearing an allocation restores the full budget.
    cy.get('@amount').clear().should('have.value', '')
    cy.contains('Budget Available: $100,000 of $100,000').should('be.visible')
  })
})
