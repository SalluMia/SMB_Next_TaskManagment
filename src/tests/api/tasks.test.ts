import request from 'supertest';
import app from '../../src/app'; // Adjust path to your app
let token: string;

beforeAll(async () => {
  // Login to get a token for authorization in task-related API tests
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      username: 'testuser',
      password: 'Test1234!',
    });

  token = res.body.token;
});

describe('Task API Tests', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Sample Task',
        description: 'Task description',
        dueDate: '2024-12-12',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Sample Task');
  });

  it('should get paginated tasks', async () => {
    const res = await request(app)
      .get('/api/tasks?page=1&limit=5')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('tasks');
  });
});
