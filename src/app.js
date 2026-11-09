const express = require('express');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(express.json());

// Rotas da API
app.use('/api/tasks', taskRoutes);

// Tratamento de rotas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Middleware global de tratamento de erro
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Erro interno no servidor' });
});

module.exports = app;
