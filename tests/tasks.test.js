const request = require('supertest');
const app = require('../src/app');
const taskController = require('../src/controllers/taskController');

describe('TaskFlow API - Testes de Integração', () => {
  beforeEach(() => {
    taskController._reset();
  });

  it('deve listar tarefas vazias inicialmente', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('deve criar uma nova tarefa com sucesso', async () => {
    const payload = {
      title: 'Tarefa de Teste',
      description: 'Descrição da tarefa de teste',
      status: 'pending'
    };

    const res = await request(app).post('/api/tasks').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe(payload.title);
    expect(res.body.status).toBe('pending');
  });

  it('deve rejeitar criação sem título ou com título curto', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'ab',
      status: 'pending'
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validação falhou');
  });

  it('deve rejeitar status inválido', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Tarefa Válida',
      status: 'invalido'
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validação falhou');
  });

  it('deve atualizar uma tarefa existente', async () => {
    const created = await request(app).post('/api/tasks').send({
      title: 'Original',
      description: 'Desc'
    });

    const updateRes = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .send({
        title: 'Atualizado',
        description: 'Nova Desc',
        status: 'completed'
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.title).toBe('Atualizado');
    expect(updateRes.body.status).toBe('completed');
  });

  it('deve remover uma tarefa', async () => {
    const created = await request(app).post('/api/tasks').send({
      title: 'Para Remover'
    });

    const deleteRes = await request(app).delete(`/api/tasks/${created.body.id}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/tasks/${created.body.id}`);
    expect(getRes.status).toBe(404);
  });
});
