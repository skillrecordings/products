/// <reference types="cypress" />

describe('Smoke Test', () => {
  it('should render', () => {
    cy.visit('http://localhost:3004')

    cy.get('[data-test-id="navigation-title"]').contains('Skill Recordings')
  })
})
