const request = require('supertest');
const app = require('../src/app');

describe('TaskFlow API Tests', () => {
  let createdTaskId;

  it('deve criar uma nova tarefa', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Teste Unitário',
        description: 'Descrição do teste',
        status: 'pendente'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual('Teste Unitário');
    createdTaskId = res.body.id;
  });

  it('deve listar as tarefas', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('deve atualizar uma tarefa', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .send({ status: 'concluida' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('concluida');
  });

  it('deve excluir uma tarefa', async () => {
    const res = await request(app).delete(`/api/tasks/${createdTaskId}`);
    expect(res.statusCode).toEqual(204);
  });
});
