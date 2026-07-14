export function renderTaskList(container, tasks, { onToggle, onDelete }) {
  container.innerHTML = '';

  if (tasks.length === 0) {
    container.innerHTML = '<p class="empty-message">No hay tareas para mostrar</p>';
    return;
  }

  tasks.forEach(task => {
    const taskDiv = createTaskElement(task, { onToggle, onDelete });
    container.appendChild(taskDiv);
  });
}

function createTaskElement(task, { onToggle, onDelete }) {
  const taskDiv = document.createElement('div');
  taskDiv.className = task.completed ? 'task-item completed' : 'task-item';

  const textSpan = document.createElement('span');
  textSpan.textContent = task.text; // textContent, no innerHTML: evita XSS

  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'task-buttons';

  const completeBtn = document.createElement('button');
  completeBtn.className = 'complete-btn';
  completeBtn.textContent = task.completed ? 'Reactivar' : 'Completar';
  completeBtn.onclick = () => onToggle(task.id);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Eliminar';
  deleteBtn.onclick = () => onDelete(task.id);

  buttonsDiv.appendChild(completeBtn);
  buttonsDiv.appendChild(deleteBtn);
  taskDiv.appendChild(textSpan);
  taskDiv.appendChild(buttonsDiv);

  return taskDiv;
}

export function renderStats(container, { total, completed, active }) {
  container.textContent = `Total: ${total} | Completadas: ${completed} | Activas: ${active}`;
}