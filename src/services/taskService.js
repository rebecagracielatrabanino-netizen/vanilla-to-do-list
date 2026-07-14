import { getTasks, saveTasks } from '../storage/taskStorage.js';

let tasks = getTasks();
let nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

export function getAllTasks() {
  return tasks;
}

export function addTask(text) {
  const trimmed = text.trim();
  if (trimmed === '') {
    throw new Error('Por favor escribe una tarea');
  }

  const newTask = {
    id: nextId++,
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

export function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks(tasks);
  }
}

export function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
}

export function filterTasks(allTasks, filter) {
  if (filter === 'active') return allTasks.filter(t => !t.completed);
  if (filter === 'completed') return allTasks.filter(t => t.completed);
  return allTasks;
}

export function getStats(allTasks) {
  const total = allTasks.length;
  const completed = allTasks.filter(t => t.completed).length;
  return { total, completed, active: total - completed };
}