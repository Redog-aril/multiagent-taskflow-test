const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Servir frontend estático se necessário
const path = require('path');
app.use(express.static(path.join(__dirname, '../../frontend')));

// Criar Tarefa
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'O título é obrigatório.' });
    }
    const validStatus = ['pendente', 'em_andamento', 'concluida'];
    const taskStatus = validStatus.includes(status) ? status : 'pendente';

    const task = await prisma.task.create({
      data: { title, description, status: taskStatus }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
});

// Listar Tarefas (com filtro por status e busca por título)
app.get('/api/tasks', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'todos') {
      query.status = status;
    }

    if (search) {
      query.title = { contains: search };
    }

    const tasks = await prisma.task.findMany({
      where: query,
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar tarefas.' });
  }
});

// Atualizar Tarefa
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const taskExists = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!taskExists) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    const updatedData = {};
    if (title !== undefined) updatedData.title = title;
    if (description !== undefined) updatedData.description = description;
    if (status !== undefined) {
      const validStatus = ['pendente', 'em_andamento', 'concluida'];
      if (!validStatus.includes(status)) {
        return res.status(400).json({ error: 'Status inválido.' });
      }
      updatedData.status = status;
    }

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: updatedData
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
});

// Excluir Tarefa
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const taskExists = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!taskExists) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    await prisma.task.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir tarefa.' });
  }
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`TaskFlow rodando na porta ${PORT}`);
  });
}

module.exports = app;
