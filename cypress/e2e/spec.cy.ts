describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('Ingresar');
    cy.url().should('include','/login');
  });

  it("Valid credentials goes to /dashboard", () => {
    cy.visit('/');
    cy.get('[aria-label=Email]').type("cdiaz@example.com");
    cy.get('[aria-label=Contraseña]').type("cdiaz123");
    cy.get('[type=submit]').click()
    cy.url().should('include','/dashboard');
  });

  it("Invalid credentials returns error", () => {
    cy.visit('/');
    cy.get('[aria-label=Email]').type("cdiaz@email.com");
    cy.get('[aria-label=Contraseña]').type("cdiaz123");
    cy.get('[type=submit]').click();
    cy.contains("Error al autenticar. Intente de nuevo.");
  });

  it('Obpen library page', () => {
    cy.visit('/');
    cy.get('[aria-label=Email]').type("cdiaz@example.com");
    cy.get('[aria-label=Contraseña]').type("cdiaz123");
    cy.get('[type=submit]').click();
    cy.url().should('include','/dashboard');
    cy.get('[data-cy=open-menu]').click();
    cy.get('[data-cy=Biblioteca]').click();
    cy.url().should('include','/library');
  });

  it('Creates a new book from library page', () => {
    cy.intercept('POST', '**/api/books', { statusCode: 201}).as('apiCall');

    cy.login('cdiaz@exmple.com', 'cdiaz123');

    cy.visit('/library');

    cy.get('[data-cy=open-book-create]').click();
    cy.url().should('include','/library/new');

    const isbn = `${Date.now()}`.slice(0, 10);

    cy.get('[data-cy=book-isbn]').type(isbn);
    cy.get('[data-cy=book-title]').type('Nuevo libro de prueba');
    cy.get('[data-cy=book-authors]').type('Autor Prueba 1, Autor Prueba 2');
    cy.get('[data-cy=book-description]').type('Descripción de prueba para el nuevo libro.');
    cy.get('[data-cy=book-thumbnail]').type('https://example.com/portada.jpg');
    cy.get('[data-cy=book-status]').select('DESEADO');
    cy.get('[data-cy=book-rating]').type('4');

    cy.get('[data-cy=book-create-submit]').click();

    cy.wait('@apiCall');

    cy.url().should('include','/library');
  });
})
