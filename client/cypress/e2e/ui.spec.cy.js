describe('UI flows', () => {
  beforeEach(() => {

    cy.visit('/login');
  });

  it('login invalid shows error', () => {
    cy.get('input[placeholder="username"]').type('x');
    cy.get('input[placeholder="password"]').type('y');
    cy.contains('Entrar').click();
    cy.get('[data-cy="login-error"]').should('exist');
  });

  it('login success and CRUD', () => {
    cy.get('input[placeholder="username"]').clear().type('admin');
    cy.get('input[placeholder="password"]').clear().type('123456');
    cy.contains('Entrar').click();

    cy.url().should('include', '/items');


    cy.get('[data-cy="item-input"]').type('Teste UI');
    cy.get('[data-cy="add-btn"]').click();
    cy.get('[data-cy="items-list"]').contains('Teste UI');


    cy.get('ul[data-cy="items-list"] > li[data-cy^="item-"]').first().then($li => {
      const idAttr = $li.attr('data-cy');
      const id = idAttr.split('-')[1];
      cy.log(`Editing item with ID: ${id}`);
      cy.get(`[data-cy="edit-${id}"]`).click();
      cy.get('[data-cy="item-input"]', { timeout: 20000 }).clear().type('Teste UI Editado');
      cy.get('[data-cy="save-btn"]').click();
      cy.get('[data-cy="items-list"]').contains('Teste UI Editado');

      cy.get(`[data-cy="del-${id}"]`).click();
      cy.get('[data-cy="items-list"]').should('not.contain', 'Teste UI Editado');
    });
  });
});
