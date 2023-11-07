const request = require('supertest');
const app = require('../app');

describe('POST /login', () => {
  it('should respond with 200 OK', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(response.statusCode).toBe(200);
  });
});