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

  // Append the icon first
  tabButton.appendChild(icon);

  // Set the button text after the icon
  tabButton.appendChild(document.createTextNode(projectName));

  userProjects.append(tabButton);
};
