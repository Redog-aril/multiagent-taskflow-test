const crypto = require('crypto');

let tasks = [];

const taskController = {
  list(req, res) {
    const { status } = req.query;
    if (status) {
      const filtered = tasks.filter((t) => t.status === status);
      return res.json(filtered);
    }
    return res.json(tasks);
  },

  getById(req, res) {
    const { id } = req.params;
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    return res.json(task);
  },

  create(req, res) {
    const { title, description, status } = req.validatedBody;
    const now = new Date().toISOString();

    const newTask = {
      id: crypto.randomUUID(),
      title,
      description: description || '',
      status: status || 'pending',
      createdAt: now,
      updatedAt: now
    };

    tasks.push(newTask);
    return res.status(201).json(newTask);
  },

  update(req, res) {
    const { id } = req.params;
    const { title, description, status } = req.validatedBody;

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    const updatedTask = {
      ...tasks[taskIndex],
      title,
      description: description !== undefined ? description : tasks[taskIndex].description,
      status: status || tasks[taskIndex].status,
      updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    return res.json(updatedTask);
  },

  delete(req, res) {
    const { id } = req.params;
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    tasks.splice(taskIndex, 1);
    return res.status(204).send();
  },

  _reset() {
    tasks = [];
  }
};

module.exports = taskController;
