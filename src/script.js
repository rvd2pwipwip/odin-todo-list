import './styles.css';
import { Task, Project, ProjectLibrary } from './todoVoodoo.js';
import { addTaskDialog } from './components/taskDialog.js';
import { addProjectDialog } from './components/projectDialog.js';
import { filterTodayTasks, filterWeekTasks } from './utils/dateUtils.js';
import { saveProjectsToLocalStorage } from './services/projectManager.js';
import {
  drawProjectTabList,
  clearProjectList,
} from './components/projectUI.js';
import { UIState } from './utils/uiStateManager.js';
import { drawTasklist } from './components/taskUI.js';

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
      console.log('loadData data.projects', data.projects);
      console.log('loadData currentLibrary', currentLibrary);
      saveProjectsToLocalStorage(currentLibrary); // Save fetched data to LocalStorage
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
    // specifically target only elements with role="tab"
    if (targetTab) {
      const targetId = targetTab.getAttribute('data-id');
      const targetName = targetTab
        .querySelector('.tab-text')
        .textContent.trim();

      // Handle different tab types
      switch (targetId) {
        case 'all-tab':
          UIState.setAddTaskButtonState(true);
          UIState.setSelectedProject(targetId);
          UIState.updateHeader(targetName);
          drawTasklist(currentLibrary, targetId);
          break;
        case 'today-tab':
          UIState.setAddTaskButtonState(false);
          UIState.setSelectedProject(targetId);
          const todayTasks = filterTodayTasks(currentLibrary);

          const todayProjects = currentLibrary.projects
            .map((project) => ({
              name: project.name,
              tasks: project.tasks.filter((task) => todayTasks.includes(task)),
            }))
            .filter((project) => project.tasks.length > 0);

          UIState.updateHeader(targetName);
          drawTasklist({ projects: todayProjects }, null);
          break;

        case 'week-tab':
          UIState.setAddTaskButtonState(false);
          UIState.setSelectedProject(targetId);
          const weekTasks = filterWeekTasks(currentLibrary);
          const weekProjects = currentLibrary.projects
            .map((project) => ({
              name: project.name,
              tasks: project.tasks.filter((task) => weekTasks.includes(task)),
            }))
            .filter((project) => project.tasks.length > 0);

          UIState.updateHeader(targetName);
          drawTasklist({ projects: weekProjects }, null, targetName);
          break;
        default:
          UIState.setAddTaskButtonState(true);
          if (targetId) {
            UIState.updateHeader(targetName);
            UIState.setSelectedProject(targetId);
            drawTasklist(currentLibrary, targetId);
          } else {
            console.log('Project not found:', targetName);
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
    if (UIState.selectedProjectId) {
      taskDialog = addTaskDialog(UIState.selectedProjectId);
      document.getElementById('dialog-placeholder').appendChild(taskDialog);
    } else {
      // Handle the case where no project is selected
      taskDialog = addTaskDialog(undefined); // Pass null or undefined
      document.getElementById('dialog-placeholder').appendChild(taskDialog);

      // Add task to a general list or "unassigned" project
      const unassignedProject = currentLibrary.projects.find(
        (p) => p.name === 'Unassigned'
      );
    }

    const form = document.querySelector('#form');
    form.reset();
    taskDialog.showModal();
  });
}

export async function initializeApp() {
  await loadData();
  clearProjectList();
  drawProjectTabList();
  drawTasklist(currentLibrary);
  setupNavigation();
  document.querySelector('button[data-id="all-tab"]').click();
  setupButtons();
}

document.addEventListener('DOMContentLoaded', initializeApp);

/////////////////////////////////////////////////////////
// Helper functions
/////////////////////////////////////////////////////////

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
  // Clear the current projects in the library
  currentLibrary.projects = [];

  console.log('populateProjectLibrary projectsData', projectsData);

  projectsData.forEach((projectData) => {
    const project = new Project(projectData.name);
    console.log('project id', project.id);
    projectData.tasks.forEach((taskData) => {
      const task = new Task(
        taskData.title,
        taskData.description,
        taskData.dueDate,
        taskData.priority,
        taskData.done,
        taskData.id
      );
      project.addTask(task);
    });
    currentLibrary.projects.push(project);
  });
  console.log(currentLibrary);
}
