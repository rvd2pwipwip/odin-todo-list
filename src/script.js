import './styles.css';
import { Task, Project, ProjectLibrary } from './todoVoodoo.js';
import { addTaskDialog } from './taskDialog.js';
import { addProjectDialog } from './projectDialog.js';
import { getTodayDateFormatted } from './dateUtils.js';
import drawTasklist from './tasklist.js';
import { drawProjectList } from './projectList.js';

export let currentProject;
export let currentLibrary = new ProjectLibrary();

/////////////////////////////////////////////////////////
// App init
/////////////////////////////////////////////////////////

async function loadData() {
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
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

function setupNavigation() {
  // Get the parent nav element for event delegation
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
      switch (tabText) {
        case 'All tasks':
          updateHeader(tabText);
          drawTasklist(currentLibrary, null, tabText);
          break;
        case 'Today':
          const todayTasks = filterTodayTasks(currentLibrary);
          updateHeader(tabText);
          drawTasklist(
            { projects: [{ projectName: tabText, tasks: todayTasks }] },
            null,
            tabText
          );
          break;
        case '7 days':
          const weekTasks = filterWeekTasks(currentLibrary);
          updateHeader(tabText);
          drawTasklist(
            { projects: [{ projectName: tabText, tasks: weekTasks }] },
            null,
            tabText
          );
          break;
        default:
          // Handle user-created project tabs
          currentProject = currentLibrary.projects.find(
            (project) => project.projectName === tabText
          );
          if (currentProject) {
            updateHeader(tabText);
            drawTasklist(currentLibrary, currentProject, tabText);
          } else {
            console.log('Project not found:', tabText);
          }
      }
    }
  });
}

function setupButtons() {
  // Add Project Button
  const addProject = document.getElementById('add-project');
  addProject.addEventListener('click', () => {
    const projectDialog = addProjectDialog();
    document.getElementById('dialog-placeholder').appendChild(projectDialog);
    const form = document.querySelector('#form');
    form.reset();
    projectDialog.showModal();
  });

  // Add Task Button
  const addTaskButton = document.getElementById('create-cta');
  let taskDialog;
  addTaskButton.addEventListener('click', () => {
    // Check if a project is currently selected
    if (currentProject) {
      taskDialog = addTaskDialog(currentProject);
      document.getElementById('dialog-placeholder').appendChild(taskDialog);
    } else {
      // Handle the case where no project is selected
      taskDialog = addTaskDialog(undefined); // Pass null or undefined
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
}

async function initializeApp() {
  await loadData();
  drawProjectList();
  drawTasklist(currentLibrary);
  setupNavigation();
  setupButtons();
}

document.addEventListener('DOMContentLoaded', initializeApp);


/////////////////////////////////////////////////////////
// Helper functions
/////////////////////////////////////////////////////////

// Save projects to LocalStorage
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

// Load projects from LocalStorage
function loadProjectsFromLocalStorage() {
  const projectsData = localStorage.getItem('projects');
  if (projectsData) {
    return JSON.parse(projectsData);
  }
  return null;
}

// Populate the project library
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

// Update the main header
export const updateHeader = (headerText) => {
  document.getElementById('main-header').innerText = headerText;
};

// Filter today's tasks
function filterTodayTasks(library) {
  const today = getTodayDateFormatted();
  return library.projects.flatMap((project) =>
    project.tasks.filter((task) => task.dueDate === today)
  );
}

// Filter tasks for the next 7 days
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
