import { currentLibrary } from './script';

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
    event.stopPropagation(); // Prevent the tab click event
    // Logic to edit the project name
    console.log(`Edit project: ${projectName}`);
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
