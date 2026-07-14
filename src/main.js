import './style.css'
import { getAllTasks, addTask, toggleTask, deleteTask, filterTasks, getStats } from './services/taskService.js';
import { renderTaskList, renderStats } from './ui/taskRenderer.js';

let currentFilter = 'all';

window.onload = function () {
  document.getElementById('addBtn').onclick = handleAddTask;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => handleFilterChange(btn.getAttribute('data-filter'));
  });

  document.getElementById('taskInput').onkeypress = function (e) {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  refreshView();
};

function handleAddTask() {
  const input = document.getElementById('taskInput');

  try {
    addTask(input.value);
    input.value = '';
    refreshView();
  } catch (error) {
    alert(error.message);
  }
}

function handleToggleTask(id) {
  toggleTask(id);
  refreshView();
}

function handleDeleteTask(id) {
  deleteTask(id);
  refreshView();
}

function handleFilterChange(filter) {
  currentFilter = filter;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
  });

  refreshView();
}

function refreshView() {
  const allTasks = getAllTasks();
  const visibleTasks = filterTasks(allTasks, currentFilter);

  renderTaskList(
    document.getElementById('taskList'),
    visibleTasks,
    { onToggle: handleToggleTask, onDelete: handleDeleteTask }
  );

  renderStats(document.getElementById('stats'), getStats(allTasks));
}