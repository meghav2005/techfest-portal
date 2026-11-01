process.env.JWT_SECRET = 'test-secret';
process.env.SECURITY_MODE = 'secure';
const request = require('supertest');
const app = require('../app');
const H = { 'X-Requested-With': 'XMLHttpRequest' };

test('health check works and Helmet headers are present', async () => {
  const res = await request(app).get('/api/health');
  expect(res.status).toBe(200);
  expect(res.headers['x-content-type-options']).toBe('nosniff');
  expect(res.headers['x-powered-by']).toBeUndefined();
});

test('NoSQL injection object in login is rejected', async () => {
  const res = await request(app).post('/api/auth/login').set(H).send({ email: { $gt: '' }, password: { $gt: '' } });
  expect(res.status).toBe(400);
});

test('register rejects weak input', async () => {
  const res = await request(app).post('/api/auth/register').set(H).send({ name: 'A', email: 'bad', password: '123' });
  expect(res.status).toBe(400);
  expect(res.body.errors.length).toBeGreaterThan(0);
});

test('POST without CSRF header is blocked', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com', password: 'x' });
  expect(res.status).toBe(403);
});

test('feedback requires login', async () => {
  const res = await request(app).post('/api/feedback').set(H).send({ message: 'hi' });
  expect(res.status).toBe(401);
});
