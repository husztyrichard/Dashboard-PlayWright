const request = require('supertest');
const app = require('../server');

describe('Bug Tracker API', () => {
  test('GET /api/bugs returns array with initial bugs', async () => {
    const res = await request(app).get('/api/bugs');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('POST /api/bugs validates title', async () => {
    const res = await request(app).post('/api/bugs').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /api/bugs creates and prevents duplicates', async () => {
    const title = `test-bug-${Date.now()}`;
    const create = await request(app).post('/api/bugs').send({ title, priority: 'LOW' });
    expect(create.status).toBe(201);
    expect(create.body).toHaveProperty('id');
    expect(create.body.title).toBe(title);

    const dup = await request(app).post('/api/bugs').send({ title, priority: 'LOW' });
    expect(dup.status).toBe(400);
  });

  test('PUT /api/bugs/:id updates fields', async () => {
    const list = await request(app).get('/api/bugs');
    const id = list.body[0].id;
    const put = await request(app).put(`/api/bugs/${id}`).send({ status: 'CLOSED' });
    expect(put.status).toBe(200);
    expect(put.body.status).toBe('CLOSED');
  });

  test('DELETE /api/bugs/:id removes a bug', async () => {
    // create a bug to delete
    const title = `delete-bug-${Date.now()}`;
    const created = await request(app).post('/api/bugs').send({ title, priority: 'MEDIUM' });
    expect(created.status).toBe(201);
    const id = created.body.id;

    const del = await request(app).delete(`/api/bugs/${id}`);
    expect(del.status).toBe(200);

    const list = await request(app).get('/api/bugs');
    const found = list.body.find(b => b.id === id);
    expect(found).toBeUndefined();
  });

  test('GET /api/status returns OK', async () => {
    const res = await request(app).get('/api/status');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });
});
