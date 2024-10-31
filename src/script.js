import './styles.css';
import { Task, Project, ProjectLibrary } from './todoVoodoo.js';
import { addTaskDialog } from './taskDialog.js';
import { addProjectDialog } from './projectDialog.js';
import { filterTodayTasks, filterWeekTasks } from './dateUtils.js';
import drawTasklist from './taskManager.js';
import { saveProjectsToLocalStorage } from './projectManager.js';
import { drawProjectList, clearProjectList } from './projectUI.js';
import { UIState } from './uiStateManager.js';

export let currentLibrary = new ProjectLibrary();

/////////////////////////////////////////////////////////
// MutationObserver
/////////////////////////////////////////////////////////

// Function to observe changes in aria-selected attribute
export function observeTabSelection() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'aria-selected'
      ) {
        console.log('Mutation observed:', mutation.target.outerHTML);
      }
    }
  });

  // Observe all tab buttons within #project-list
  const allTabs = document.querySelectorAll('#project-list button[role="tab"]');
  allTabs.forEach((tab) => {
    observer.observe(tab, { attributes: true });
  });
}

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

      function getTabText(targetTab) {
        // Find the span with the class 'tab-text' within the button
        const textSpan = targetTab.querySelector('.tab-text');

        // Return the text content of the span, or an empty string if not found
        return textSpan ? textSpan.textContent.trim() : '';
      }

      const tabText = getTabText(targetTab);

      function getProjectIdByName(projectName, currentLibrary) {
        const project = currentLibrary.projects.find(
          (proj) => proj.name === projectName
        );
        return project ? project.id : null;
      }
      const currentId = getProjectIdByName(tabText, currentLibrary);

      // Handle different tab types
      switch (tabText) {
        case 'All tasks':
          setAddTaskButtonState(true);
          UIState.setSelectedProject(null);
          UIState.updateHeader(tabText);
          drawTasklist(currentLibrary, currentId);
          break;
        case 'Today':
          setAddTaskButtonState(false);
          const todayTasks = filterTodayTasks(currentLibrary);

          const todayProjects = currentLibrary.projects
            .map((project) => ({
              name: project.name,
              tasks: project.tasks.filter((task) => todayTasks.includes(task)),
            }))
            .filter((project) => project.tasks.length > 0);

          UIState.updateHeader(tabText);
          drawTasklist({ projects: todayProjects }, null);
          break;

        case '7 days':
          setAddTaskButtonState(false);
          const weekTasks = filterWeekTasks(currentLibrary);
          const weekProjects = currentLibrary.projects
            .map((project) => ({
              name: project.name,
              tasks: project.tasks.filter((task) => weekTasks.includes(task)),
            }))
            .filter((project) => project.tasks.length > 0);

          UIState.updateHeader(tabText);
          drawTasklist({ projects: weekProjects }, null, tabText);
          break;
        default:
          setAddTaskButtonState(true);
          if (currentId) {
            UIState.updateHeader(tabText);
            drawTasklist(currentLibrary, currentId);
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
  drawProjectList();
  drawTasklist(currentLibrary);
  setupNavigation();
  // observeTabSelection();
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

  projectsData.forEach((projectData) => {
    const project = new Project(projectData.name);
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
// export const updateHeader = (headerText) => {
//   document.getElementById('main-header').innerText = headerText;
// };

// Manage add task button state
function setAddTaskButtonState(enabled) {
  const addTaskButton = document.getElementById('create-cta');
  addTaskButton.disabled = !enabled;
  addTaskButton.classList.toggle('disabled', !enabled);
}
