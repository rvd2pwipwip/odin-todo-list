import { currentLibrary, saveProjectsToLocalStorage } from './script';

export const drawProjectList = () => {
  currentLibrary.projects
    .filter((p) => p.projectName !== 'Unassigned')
    .forEach((p) => {
      createProjectTab(p.projectName);
    });
};

export const createProjectTab = (projectName) => {
  const userProjects = document.getElementById('user-projects');

  const tabButton = document.createElement('button');
  tabButton.setAttribute('role', 'tab');
  tabButton.setAttribute('aria-selected', 'false');

  const icon = document.createElement('i');
  icon.className = 'material-icons-rounded';
  icon.innerText = 'domain_verification';

  // Append the generic icon first
  tabButton.appendChild(icon);

  // Set the button text after the icon
  const textSpan = document.createElement('span');
  textSpan.className = 'tab-text';
  textSpan.setAttribute('contenteditable', 'false');
  textSpan.innerText = projectName;
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
    const projectNameSpan = projectTab.querySelector('.tab-text');
    makeEditable(projectNameSpan);
  });
  actionContainer.appendChild(editIcon);

  // Create and append the delete icon
  const deleteIcon = document.createElement('i');
  deleteIcon.className = 'material-icons-rounded delete-icon';
  deleteIcon.innerText = 'delete';
  deleteIcon.title = 'Delete Project';
  deleteIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the tab click event
    // Logic to delete the project
    console.log(`Delete project: ${projectName}`);
  });
  actionContainer.appendChild(deleteIcon);

  tabButton.appendChild(actionContainer);

  userProjects.append(tabButton);

  return tabButton;
};

//Edit button
function makeEditable(element) {
  console.log(`Editable: ${element.textContent}`);
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
  element.addEventListener('blur', saveChanges);
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

function saveChanges(event) {
  const element = event.target;
  element.contentEditable = false;
  const newName = element.textContent.trim();
  console.log(
    `change name from ${
      element.dataset.originalText
    } to ${element.textContent.trim()}`
  );

  if (newName !== element.dataset.originalText) {
    const projectTab = element.closest('button[role="tab"]');
    updateProjectName(projectTab, newName);
  }

  // Remove event listeners
  element.removeEventListener('keydown', handleKeyDown);
  element.removeEventListener('blur', saveChanges);
}

function revertChanges(element) {
  element.textContent = element.dataset.originalText;
  element.contentEditable = false;
  element.removeEventListener('keydown', handleKeyDown);
  element.removeEventListener('blur', saveChanges);
}

function updateProjectName(projectTab, newName) {
  // Update tab button text
  projectTab.querySelector('.tab-text').textContent = newName;

  // Update currentLibrary and save to localStorage
  const spanElement = projectTab.querySelector('.tab-text');
  const originalText = spanElement.getAttribute('data-original-text');

  const projectIndex = currentLibrary.projects.findIndex(
    (p) => p.projectName === originalText
  );

  if (projectIndex !== -1) {
    // Update the project name in the currentLibrary
    currentLibrary.projects[projectIndex].projectName = newName;

    // Save the updated projects to localStorage
    saveProjectsToLocalStorage(currentLibrary);

    // Remove the data-original-text attribute
    spanElement.removeAttribute('data-original-text');
  }
}
