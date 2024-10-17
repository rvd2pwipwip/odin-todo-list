import './styles.css';
import { Task, Project, ProjectLibrary } from './todoVoodoo.js';
import { addTaskDialog } from './taskDialog.js';
import { addProjectDialog } from './projectDialog.js';
import { getTodayDateFormatted } from './dateUtils.js';
import drawTasklist from './tasklist.js';
import { drawProjectList, createProjectTab } from './projectList.js';

export let currentProject;
export let currentLibrary = new ProjectLibrary();

// Function to save projects to LocalStorage
function saveProjectsToLocalStorage() {
  const projectsData = currentLibrary.projects.map((project) => ({
    projectName: project.projectName,
    tasks: project.tasks.map((task) => ({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      done: task.done,
    })),
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
    drawTasklist(currentLibrary);
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
    currentLibrary.projects.push(project);
  });
}

// Call fetchAndPopulateTasks and then drawProjectlist
(async () => {
  await fetchAndPopulateTasks();
  drawProjectList();

  // Initialize tabs after the project list is drawn
  const tabs = Array.from(document.querySelectorAll('nav [role="tab"]'));

  tabs.forEach((t) => {
    t.addEventListener('click', (e) => {
      // Check if the clicked element is the button or its child
      const targetButton = e.target.closest('button[role="tab"]');
      if (
        targetButton &&
        targetButton.getAttribute('aria-selected') == 'false'
      ) {
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
        let filteredProject = buttonClone.textContent.trim();
        console.log('Filtered Project:', filteredProject);

        // Check if the clicked button is the "Today" button
        if (targetButton.id === 'today-btn') {
          const today = getTodayDateFormatted();
          const todayTasks = [];
          currentLibrary.projects.forEach((project) => {
            project.tasks.forEach((task) => {
              if (task.dueDate === today) {
                todayTasks.push(task);
              }
            });
          });
          drawTasklist({
            projects: [{ projectName: 'Today', tasks: todayTasks }],
          });
        } else {
          currentProject = currentLibrary.projects.find(
            (project) => project.projectName === filteredProject
          );

          if (currentProject) {
            console.log('Current Project:', currentProject);
            drawTasklist(currentLibrary, currentProject);
          } else {
            drawTasklist(currentLibrary);
            console.log('Project not found:', filteredProject);
          }
        }
      }
    });
  });
})();

console.log(currentLibrary);

// Add Project Dialog
const addProject = document.getElementById('add-project');

addProject.addEventListener('click', () => {
  const projectDialog = addProjectDialog();
  document.getElementById('dialog-placeholder').appendChild(projectDialog);
  const form = document.querySelector('#form');
  form.reset();
  projectDialog.showModal();
  console.log('project added');
});

// Add Task Dialog
// Add event listener for the create button to show the dialog
const addTaskButton = document.getElementById('create-cta');
let taskDialog;
addTaskButton.addEventListener('click', () => {
  // Check if a project is currently selected
  if (currentProject) {
    taskDialog = addTaskDialog(currentProject);
    console.log(
      `Button clicked while current project is: ${currentProject.projectName}`
    );
    document.getElementById('dialog-placeholder').appendChild(taskDialog);
  } else {
    // Handle the case where no project is selected
    taskDialog = addTaskDialog(undefined); // Pass null or undefined
    console.log('Button clicked with no current project selected');
    document.getElementById('dialog-placeholder').appendChild(taskDialog);

    // Add task to a general list or "unassigned" project
    const unassignedProject = currentLibrary.projects.find(
      (project) => project.projectName === 'Unassigned'
    );
  }

  const form = document.querySelector('#form');
  form.reset();
  taskDialog.showModal();
});
