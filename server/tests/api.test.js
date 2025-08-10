const request = require('supertest');
const app = require('../src/server');
const db = require('../src/data');

beforeEach(() => db.reset());

describe('Auth com HttpOnly Cookie', () => {
  const agent = request.agent(app); // mantém cookies entre requisições

  test('login success (cookie definido)', async () => {
    const res = await agent
      .post('/login')
      .send({ username: "admin", password: "123456" })
      .expect(200);

    // Garante que o cookie foi setado
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toMatch(/token=/);
  });

  test('login inválido', async () => {
    await request(app)
      .post('/login')
      .send({ username: 'x', password: 'y' })
      .expect(401);
  });

  test('login campos faltando', async () => {
    await request(app)
      .post('/login')
      .send({ username: 'admin' })
      .expect(400);
  });

  test('acessar rota protegida após login', async () => {
    await agent.post('/login')
      .send({ username: "admin", password: "123456" })
      .expect(200);

    const res = await agent.get('/items').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('falhar ao acessar rota sem login', async () => {
    await request(app).get('/items').expect(401);
  });

  test('falhar com token inválido no cookie', async () => {
    await request(app)
      .get('/items')
      .set('Cookie', 'token=invalidtoken')
      .expect(403);
  });
});

describe('Items CRUD (com autenticação obrigatória)', () => {

  test('create item success', async () => {
    const res = await request(app)
      .post('/items')
      .send({ title: 'Novo' });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  test('create item missing title', async () => {
    const res = await request(app)
      .post('/items')
      .send({ description: 'sem titulo' });
    expect(res.statusCode).toBe(400);
  });

  test('update existing item', async () => {
    const resCreate = await request(app).post('/items').send({ title: 'X' });
    const id = resCreate.body.id;
    const res = await request(app)
      .put(`/items/${id}`)
      .send({ title: 'X2' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('X2');
  });

  test('update non-existent', async () => {
    await request(app)
      .put('/items/999')
      .send({ title: 'no' })
      .expect(404);
  });

  test('delete existing', async () => {
    const resCreate = await request(app).post('/items').send({ title: 'toDel' });
    const id = resCreate.body.id;
    await request(app).delete(`/items/${id}`).expect(204);
  });

  test('delete non-existent', async () => {
    await request(app).delete('/items/9999').expect(404);
  });
});
