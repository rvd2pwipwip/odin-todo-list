import './styles.css';
import { Task, Project, projectLibrary } from './todoVoodoo.js';
import { createTaskDialog } from './taskDialog.js';
import drawTasklist from './tasklist.js';

let currentProject;

// Function to save projects to LocalStorage
function saveProjectsToLocalStorage() {
  const projectsData = projectLibrary.map(project => ({
    projectName: project.projectName,
    tasks: project.tasks.map(task => ({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      done: task.done
    }))
  }));
  localStorage.setItem('projects', JSON.stringify(projectsData));
}

// Function to load projects from LocalStorage
function loadProjectsFromLocalStorage() {
  const projectsData = localStorage.getItem('projects');
  if (projectsData) {
    return JSON.parse(projectsData);
  }
  return null;
}

// Function to fetch and populate tasks from JSON or LocalStorage
async function fetchAndPopulateTasks() {
  try {
    const storedProjects = loadProjectsFromLocalStorage();
    if (storedProjects) {
      populateProjectLibrary(storedProjects);
    } else {
      const response = await fetch('todoDB.json');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      populateProjectLibrary(data.projects);
      saveProjectsToLocalStorage(); // Save fetched data to LocalStorage
    }
    drawTasklist(projectLibrary);
  } catch (error) {
    console.error('Failed to fetch and populate tasks:', error);
  }
}

// Function to populate the project library
function populateProjectLibrary(projectsData) {
  projectsData.forEach((projectData) => {
    const project = new Project(projectData.projectName);
    projectData.tasks.forEach((taskData) => {
      const task = new Task(
        taskData.title,
        taskData.description,
        taskData.dueDate,
        taskData.priority,
        taskData.done
      );
      project.addTask(task);
    });
    projectLibrary.push(project);
  });
}

fetchAndPopulateTasks();

const tabs = Array.from(document.querySelectorAll('nav [role="tab"]'));

tabs.forEach((t) => {
  t.addEventListener('click', (e) => {
    // Check if the clicked element is the button or its child
    const targetButton = e.target.closest('button[role="tab"]');
    if (targetButton && targetButton.getAttribute('aria-selected') == 'false') {
      tabs.forEach((t) => {
        t.setAttribute('aria-selected', false);
      });

      targetButton.setAttribute('aria-selected', 'true');

      // Create a clone of the button and remove the <i> element
      const buttonClone = targetButton.cloneNode(true);
      const iconElement = buttonClone.querySelector('i');
      if (iconElement) {
        buttonClone.removeChild(iconElement);
      }

      // Get the inner text of the cloned button
      currentProject = buttonClone.textContent.trim();
      console.log('Current Project:', currentProject);

      // Find the project by name and draw the task list
      const selectedProject = projectLibrary.find(
        (project) => project.projectName === currentProject
      );
      if (selectedProject) {
        console.log('Selected Project:', selectedProject);
        drawTasklist(projectLibrary, selectedProject);
      } else {
        drawTasklist(projectLibrary);
        console.log('Project not found:', currentProject);
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

    // TODO: check for mandatory task parameters (name)
    if (true) {
      priority = !priority ? 'Low' : priority;
      dueDate = !dueDate ? formattedDate : dueDate;
      const newTask = new Task(title, description, dueDate, priority);
      allTasks.tasks.push(newTask);
      console.log(projectLibrary);
      drawTasklist(currentProject);
    }
  }

  // Add event listener for the add button to push the new todo
  const addButton = document.getElementById('add-submit-cta');
  addButton.addEventListener('click', () => {
    addTask();
  });
});
