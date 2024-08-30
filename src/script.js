import './styles.css';
import { Task, Project, projectLibrary } from './todoVoodoo.js';
import { createTaskDialog } from './taskDialog.js';
import drawTasklist from './tasklist.js';

const allTasks = new Project('All Tasks');
const today = new Project('Today');
const week = new Project('7 days');

projectLibrary.push(...[allTasks, today, week]);

// Fetch and populate tasks from JSON
async function fetchAndPopulateTasks() {
  try {
    const response = await fetch('todoDB.json');
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    console.log('Fetched data:', data);

    // Populate 'All Tasks' default project
    const allTasksProject = data.projects.find(project => project.projectName === 'All tasks');
    if (allTasksProject) {
      allTasksProject.tasks.forEach(taskData => {
        const task = new Task(
          taskData.title,
          taskData.description,
          new Date(taskData.dueDate),
          taskData.priority,
          taskData.done
        );
        allTasks.addTask(task);
      });
    }

    // Log the tasks to confirm
    console.log('All Tasks Project:', allTasks);
  } catch (error) {
    console.error('Failed to fetch and populate tasks:', error);
  }
}

// Call the function to fetch and populate tasks
fetchAndPopulateTasks();


const tabs = Array.from(document.querySelectorAll('nav [role="tab"]'));

tabs.forEach((t) => {
  t.addEventListener('click', (e) => {
    if (e.target.getAttribute('aria-selected') == 'false') {
      tabs.forEach((t) => {
        t.setAttribute('aria-selected', false);
      });
      e.target.setAttribute('aria-selected', 'true');
      switch (e.target.getAttribute('id')) {
        case 'all-btn':
          // home();
          console.log('clicked all tasks');
          break;
        case 'today-btn':
          // menu();
          console.log('clicked today');
          break;
        case 'week-btn':
          // about();
          console.log('clicked 7 days');
          break;
        default:
          break;
      }
    }
  });
});

// Dialog

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

  function addTask() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let dueDate = document.getElementById('due-date').value;
    let priority = document.getElementById('priority').value;

    // Get today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

    if (true) {
      priority = !priority ? 'Low' : priority;
      dueDate = !dueDate ? formattedDate : dueDate;
      const newTask = new Task(title, description, dueDate, priority);
      allTasks.tasks.push(newTask);
      console.log(projectLibrary);
      // drawCardGrid();
    }
  }

  // Add event listener for the add button to push the new todo
  const addButton = document.getElementById('add-submit-cta');
  addButton.addEventListener('click', () => {
    addTask();
  });
});
