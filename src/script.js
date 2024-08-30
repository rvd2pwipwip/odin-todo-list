import './styles.css';
import { Task, Project, projectLibrary } from './todoVoodoo.js';
import { createTaskDialog } from './taskDialog.js';
import drawTasklist from './tasklist.js';

let currentProject;

// Function to fetch and populate tasks from JSON
async function fetchAndPopulateTasks() {
  try {
    const response = await fetch('todoDB.json');
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    console.log('Fetched data:', data);

    // Iterate over each project in the JSON data
    data.projects.forEach((projectData) => {
      const project = new Project(projectData.projectName);

      // Populate the project with tasks
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

      // Push the created project into the projectLibrary
      projectLibrary.push(project);

      // Log the project to confirm
      console.log(`Project: ${project.projectName}`, project);
    });

    // Display the 'All tasks' project by default
    currentProject = projectLibrary.find(
      (project) => project.projectName === 'All tasks'
    );
    if (currentProject) {
      drawTasklist(currentProject);
    }
  } catch (error) {
    console.error('Failed to fetch and populate tasks:', error);
  }
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
        drawTasklist(selectedProject);
      } else {
        console.log('Project not found:', currentProject);
      }
    }
  });
});

// tabs.forEach((t) => {
//   t.addEventListener('click', (e) => {
//     // Check if the clicked element is the button or its child
//     const targetButton = e.target.closest('button[role="tab"]');
//     if (targetButton && targetButton.getAttribute('aria-selected') == 'false') {
//       tabs.forEach((t) => {
//         t.setAttribute('aria-selected', false);
//       });

//       targetButton.setAttribute('aria-selected', 'true');
//       currentProject = targetButton.textContent.trim(); // Use textContent to get the button's text
//       console.log(currentProject);

//       // Find the project by name and draw the task list
//       const selectedProject = projectLibrary.find(
//         (project) => project.projectName === currentProject
//       );
//       if (selectedProject) {
//         drawTasklist(selectedProject);
//       }
//     }
//   });
// });

// 
// 
// 
// 
// 
// 
// 
// 
// 

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
