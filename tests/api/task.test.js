const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/utils/prismaClient');

describe('Task API', () => {
  const testUser = {
    name: 'Task User',
    email: `taskuser_${Date.now()}@example.com`,
    password: 'password123'
  };

  let token;
  let taskId;

  beforeAll(async () => {
    await request(app).post('/auth/register').send(testUser);
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.task.deleteMany({ where: { user: { email: testUser.email } } });
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it('should reject task creation without a token', async () => {
    const res = await request(app).post('/tasks').send({ title: 'No auth task' });
    expect(res.status).toBe(401);
  });

  it('should create a task for the authenticated user', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Write README' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Write README');
    taskId = res.body.id;
  });

  it("should list only the user's own tasks", async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update the task status', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Write README', status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');
  });

  it('should delete the task', async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
