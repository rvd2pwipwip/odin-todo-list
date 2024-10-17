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

  // Get the parent nav element
  const navElement = document.querySelector('nav[role="tablist"]');

  // Add event listener to the nav element
  navElement.addEventListener('click', (event) => {
    const targetTab = event.target.closest('button[role="tab"]');
    if (targetTab) {
      // Remove 'aria-selected' from all tabs
      navElement.querySelectorAll('button[role="tab"]').forEach((tab) => {
        tab.setAttribute('aria-selected', 'false');
      });

      // Set the clicked tab as selected
      targetTab.setAttribute('aria-selected', 'true');

      // Extract the project name, ignoring the icon text
      const iconElement = targetTab.querySelector('i');
      const tabText = iconElement
        ? targetTab.textContent.replace(iconElement.textContent, '').trim()
        : targetTab.textContent.trim();

      // Handle different tab types
      switch (targetTab.id) {
        case 'all-btn':
          drawTasklist(currentLibrary);
          break;
        case 'today-btn':
          // Filter and display today's tasks
          const todayTasks = filterTodayTasks(currentLibrary);
          drawTasklist({
            projects: [{ projectName: 'Today', tasks: todayTasks }],
          });
          break;
        case 'week-btn':
          // Filter and display tasks for the next 7 days
          const weekTasks = filterWeekTasks(currentLibrary);
          drawTasklist({
            projects: [{ projectName: 'Next 7 Days', tasks: weekTasks }],
          });
          break;
        default:
          // Handle user-created project tabs
          currentProject = currentLibrary.projects.find(
            (project) => project.projectName === tabText
          );
          if (currentProject) {
            drawTasklist(currentLibrary, currentProject);
          } else {
            console.log('Project not found:', tabText);
          }
      }
    }
  });

  // Helper function to filter today's tasks
  function filterTodayTasks(library) {
    const today = getTodayDateFormatted();
    return library.projects.flatMap((project) =>
      project.tasks.filter((task) => task.dueDate === today)
    );
  }

  // Helper function to filter tasks for the next 7 days
  function filterWeekTasks(library) {
    const today = new Date();
    const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return library.projects.flatMap((project) =>
      project.tasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        return taskDate >= today && taskDate <= sevenDaysLater;
      })
    );
  }
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
