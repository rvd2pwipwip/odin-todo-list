import Task from './task.js';
import Project from './project';
import './styles.css';
import { createTaskDialog } from './taskDialog.js';

const main = new Project('Today');

document.addEventListener('DOMContentLoaded', function () {
  // Create and insert the dialog content
  const dialog = createTaskDialog();
  document.getElementById('task-dialog-placeholder').appendChild(dialog);

  // Add event listener for the create button to show the dialog
  const createButton = document.getElementById('create-cta');
  createButton.addEventListener('click', () => {
    const form = document.querySelector('#form');
    form.reset();
    dialog.showModal();
  });

  // Add event listener for the close button to close the dialog
  const closeButton = dialog.querySelector('#close-btn');
  closeButton.addEventListener('click', () => {
    dialog.close();
  });

  // Add event listener to close the dialog when users click outside
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!isInDialog) {
      dialog.close();
    }
  });

  function addTodo() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let dueDate = document.getElementById('due-date').value;
    let priority = document.getElementById('priority').value;

    if (true) {
      priority = !priority ? 'Low' : priority;
      const newTask = new Task(title, description, dueDate, priority);
      main.tasks.push(newTask);
      console.log(main);
      // drawCardGrid();
    }
  }

  // Add event listener for the add button to push the new todo
  const addButton = document.getElementById('add-submit-cta');
  addButton.addEventListener('click', () => {
    addTodo();
  });
});
