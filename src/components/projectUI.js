import { currentLibrary } from '../script';
import { deleteProjectDialog } from './projectDialog';
import {
  saveProjectsToLocalStorage,
  updateProjectName,
} from '../services/projectManager';
import { UIState } from '../utils/uiStateManager';

const projectListContainer = document.createElement('div');
projectListContainer.setAttribute('id', 'project-list');

export function clearProjectList() {
  projectListContainer.innerHTML = '';
}

export const drawProjectList = () => {
  clearProjectList();
  const userProjects = document.getElementById('user-projects');

  // Append the container only if it's not already in the DOM
  if (!userProjects.contains(projectListContainer)) {
    userProjects.appendChild(projectListContainer);
  }

  currentLibrary.projects
    .filter((p) => p.name !== 'Unassigned')
    .forEach((p) => {
      const tab = drawProjectTab(p.id);
      projectListContainer.appendChild(tab);
    });
};

export const drawProjectTab = (id) => {
  const project = currentLibrary.projects.find((p) => p.id === id);
  const name = project.name;
  const tabButton = document.createElement('button');
  tabButton.setAttribute('role', 'tab');
  tabButton.setAttribute('aria-selected', 'false');
  tabButton.setAttribute('data-id', id);

  const icon = document.createElement('i');
  icon.className = 'material-icons-rounded';
  icon.innerText = 'domain_verification';

  // Append the generic icon first
  tabButton.appendChild(icon);

  // Set the button text after the icon
  const textSpan = document.createElement('span');
  textSpan.className = 'tab-text';
  textSpan.setAttribute('contenteditable', 'false');
  textSpan.innerText = name;
  tabButton.appendChild(textSpan);

  const actionContainer = document.createElement('div');
  actionContainer.className = 'actions';

  // Create and append the edit icon
  const editIcon = document.createElement('i');
  editIcon.className = 'material-icons-rounded edit-icon';
  editIcon.innerText = 'edit';
  editIcon.title = 'Edit Project';
  editIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the button click event
    const projectTab = event.target.closest('button[role="tab"]');
    const nameSpan = projectTab.querySelector('.tab-text');
    makeEditable(nameSpan);
  });
  actionContainer.appendChild(editIcon);

  // Create and append the delete icon
  const deleteIcon = document.createElement('i');
  deleteIcon.className = 'material-icons-rounded delete-icon';
  deleteIcon.innerText = 'delete';
  deleteIcon.title = 'Delete Project';
  deleteIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the tab click event
    const projectTab = event.target.closest('button[role="tab"]');
    const nameSpan = projectTab.querySelector('.tab-text');
    const projectIndex = currentLibrary.projects.findIndex(
      (p) => p.name === nameSpan.innerText
    );
    const deleteDialog = deleteProjectDialog(
      currentLibrary.projects[projectIndex].id
    );
    document.getElementById('dialog-placeholder').appendChild(deleteDialog);
    deleteDialog.showModal();
  });
  actionContainer.appendChild(deleteIcon);
  tabButton.appendChild(actionContainer);

  return tabButton;
};

/////////////////////////////////////////////////////////
// Helper functions
/////////////////////////////////////////////////////////

// Edit button
function makeEditable(element) {
  element.contentEditable = true;
  element.focus();

  // Save the original text in case we need to revert
  element.dataset.originalText = element.textContent;

  // Select all the text
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  // Add event listeners for saving changes
  element.addEventListener('keydown', handleKeyDown);
  element.addEventListener('blur', updateUI);
}

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    event.target.blur();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    revertChanges(event.target);
  }
}

function updateUI(event) {
  const element = event.target;
  element.contentEditable = false;
  const newName = element.textContent.trim();

  if (newName !== element.dataset.originalText) {
    const projectTab = element.closest('button[role="tab"]');
    updateName(projectTab, newName);
    UIState.updateHeader(newName);
  }

  // Remove event listeners
  element.removeEventListener('keydown', handleKeyDown);
  element.removeEventListener('blur', updateUI);
}

function revertChanges(element) {
  element.textContent = element.dataset.originalText;
  element.contentEditable = false;
  element.removeEventListener('keydown', handleKeyDown);
  element.removeEventListener('blur', updateUI);
}

function updateName(projectTab, newName) {
  // Update tab button text
  projectTab.querySelector('.tab-text').textContent = newName;

  // Update currentLibrary and save to localStorage
  const spanElement = projectTab.querySelector('.tab-text');
  const originalText = spanElement.getAttribute('data-original-text');

  const projectIndex = currentLibrary.projects.findIndex(
    (p) => p.name === originalText
  );

  if (projectIndex !== -1) {
    // Update the project name in the currentLibrary
    updateProjectName(projectIndex, newName);

    // Save the updated projects to localStorage
    saveProjectsToLocalStorage(currentLibrary);

    // Remove the data-original-text attribute
    spanElement.removeAttribute('data-original-text');
  }
}

export async function removeProjectUI(id) {
  const projectIndex = currentLibrary.projects.findIndex((p) => (p.id === id));

  if (projectIndex >= 0 && projectIndex < currentLibrary.projects.length) {
    // Find the tab element for the project being deleted
    const userProjectTabs = document.querySelectorAll(
      '#project-list button[role="tab"]'
    );

    // Remove the deleted project UI from the DOM
    const tabToDelete = Array.from(userProjectTabs).find(
      (t) => t.getAttribute('data-id') === id
    );

    if (tabToDelete) {
      tabToDelete.remove();
    }
  }
}
