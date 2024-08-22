import Todo from './todo.js';
import Project from './project';
import './styles.css';
import { createDialog } from './dialog.js';

const main = new Project('Today');

document.addEventListener('DOMContentLoaded', function () {
  // Create and insert the dialog content
  const dialog = createDialog();
  document.getElementById('dialog-placeholder').appendChild(dialog);

  // Add event listener for the create button to show the dialog
  const createButton = document.getElementById('create-cta');
  createButton.addEventListener('click', () => {
    dialog.showModal();
  });

  // Add event listener for the close button to close the dialog
  const closeButton = dialog.querySelector('#close-btn');
  closeButton.addEventListener('click', () => {
    dialog.close();
  });

  function addTodo() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let dueDate = document.getElementById('due-date').value;
    let priority = document.getElementById('priority').value;

    if (true) {
      const newTodo = new Todo(title, description, dueDate, (priority = 'Low'));
      main.todos.push(newTodo);
      console.log(main);
      // drawCardGrid();
    }
  }

  // Add event listener for the add button to push the new todo
  const addButton = document.getElementById('add-submit');
  addButton.addEventListener('click', () => {
    addTodo();
  });
});
