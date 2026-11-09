const API_URL = '/api/tasks';

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();

  document.getElementById('taskForm').addEventListener('submit', handleCreateTask);
  document.getElementById('search').addEventListener('input', debounce(loadTasks, 300));
  document.getElementById('filterStatus').addEventListener('change', loadTasks);
});

async function loadTasks() {
  const search = document.getElementById('search').value;
  const status = document.getElementById('filterStatus').value;

  let url = `${API_URL}?`;
  if (search) url += `search=${encodeURIComponent(search)}&`;
  if (status && status !== 'todos') url += `status=${status}&`;

  try {
    const response = await fetch(url);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
  }
}

function renderTasks(tasks) {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
    return;
  }

  tasks.forEach(task => {
    const item = document.createElement('div');
    item.className = 'task-item';
    
    item.innerHTML = `
      <div class="task-info">
        <h3>${escapeHtml(task.title)}</h3>
        <p>${escapeHtml(task.description || '')}</p>
        <span class="badge ${task.status}">${formatStatus(task.status)}</span>
      </div>
      <div class="task-actions">
        <button class="btn-edit" onclick="editTask(${task.id}, '${task.status}')">Status</button>
        <button class="btn-danger" onclick="deleteTask(${task.id})">Excluir</button>
      </div>
    `;
    taskList.appendChild(item);
  });
}

async function handleCreateTask(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const status = document.getElementById('status').value;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status })
    });

    if (response.ok) {
      document.getElementById('taskForm').reset();
      loadTasks();
    }
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
  }
}

async function editTask(id, currentStatus) {
  const statuses = ['pendente', 'em_andamento', 'concluida'];
  const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });

    if (response.ok) {
      loadTasks();
    }
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
  }
}

async function deleteTask(id) {
  if (!confirm('Deseja realmente excluir esta tarefa?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      loadTasks();
    }
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
  }
}

function formatStatus(status) {
  const map = {
    'pendente': 'Pendente',
    'em_andamento': 'Em Andamento',
    'concluida': 'Concluída'
  };
  return map[status] || status;
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
