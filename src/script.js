import './styles.css';
import { Task, Project, ProjectLibrary } from './todoVoodoo.js';
import { addTaskDialog } from './taskDialog.js';
import { addProjectDialog } from './projectDialog.js';
import { filterTodayTasks, filterWeekTasks } from './dateUtils.js';
import drawTasklist from './tasklist.js';
import { drawProjectList } from './projectList.js';

let currentProject = null;
export function setCurrentProject(project) {
  currentProject = project;
}

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

      function getTabText(targetTab) {
        // Find the span with the class 'tab-text' within the button
        const textSpan = targetTab.querySelector('.tab-text');

        // Return the text content of the span, or an empty string if not found
        return textSpan ? textSpan.textContent.trim() : '';
      }

      const tabText = getTabText(targetTab);

      // Handle different tab types
      switch (tabText) {
        case 'All tasks':
          setAddTaskButtonState(true);
          setCurrentProject(null);
          updateHeader(tabText);
          drawTasklist(currentLibrary, currentProject);
          break;
        case 'Today':
          setAddTaskButtonState(false);
          const todayTasks = filterTodayTasks(currentLibrary);

          const todayProjects = currentLibrary.projects
            .map((project) => ({
              projectName: project.projectName,
              tasks: project.tasks.filter((task) => todayTasks.includes(task)),
            }))
            .filter((project) => project.tasks.length > 0);

          updateHeader(tabText);
          drawTasklist({ projects: todayProjects }, null);
          break;

        case '7 days':
          setAddTaskButtonState(false);
          const weekTasks = filterWeekTasks(currentLibrary);
          const weekProjects = currentLibrary.projects
            .map((project) => ({
              projectName: project.projectName,
              tasks: project.tasks.filter((task) => weekTasks.includes(task)),
            }))
            .filter((project) => project.tasks.length > 0);

          console.log(weekProjects); // Debugging: Check the content of weekProjects

          updateHeader(tabText);
          drawTasklist({ projects: weekProjects }, null, tabText);
          break;
        default:
          setAddTaskButtonState(true);
          // Handle user-created project tabs
          currentProject = currentLibrary.projects.find(
            (project) => project.projectName === tabText
          );
          if (currentProject) {
            updateHeader(tabText);
            drawTasklist(currentLibrary, currentProject);
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
export function saveProjectsToLocalStorage() {
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

// Manage add task button state
function setAddTaskButtonState(enabled) {
  const addTaskButton = document.getElementById('create-cta');
  addTaskButton.disabled = !enabled;
  addTaskButton.classList.toggle('disabled', !enabled);
}
