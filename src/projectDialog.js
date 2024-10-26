import { Project } from './todoVoodoo.js';
import { currentLibrary, updateHeader, setCurrentProject } from './script';
import { createProjectTab, deleteProject } from './projectList.js';
import drawTasklist from './taskManager.js';

export function addProjectDialog() {
  const dialog = document.createElement('dialog');

  const form = document.createElement('form');
  form.setAttribute('action', '');
  form.setAttribute('method', 'dialog');
  form.id = 'form';

  const fieldset = document.createElement('fieldset');

  const legend = document.createElement('legend');
  legend.textContent = 'New Project';

  const closeButton = document.createElement('button');
  closeButton.id = 'close-btn';
  closeButton.textContent = '×';
  dialog.appendChild(closeButton);

  fieldset.appendChild(legend);

  const formItems = [{ label: 'Project Name', id: 'name', type: 'text' }];

  formItems.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'form-item';

    const label = document.createElement('label');
    label.setAttribute('for', item.id);
    label.textContent = item.label;

    let input;

    input = document.createElement('input');
    input.type = item.type;

    input.id = item.id;
    input.name = item.id;
    input.required = true;

    div.appendChild(label);
    div.appendChild(input);
    fieldset.appendChild(div);
  });

  const buttonDiv = document.createElement('div');
  const addButton = document.createElement('button');
  addButton.style.width = '100%';
  addButton.id = 'add-submit-cta';

  // Create the icon element
  const icon = document.createElement('span');
  icon.className = 'material-icons-rounded';
  icon.innerHTML = 'add';
  // Append the icon to the button first
  addButton.appendChild(icon);
  // Add the button text after the icon
  addButton.innerHTML += 'Add Project';

  buttonDiv.appendChild(addButton);
  fieldset.appendChild(buttonDiv);

  form.appendChild(fieldset);
  dialog.appendChild(form);

  // Add event listener to the add button
  addButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default form submission

    const nameInput = form.querySelector('#name');
    const name = nameInput.value.trim();

    if (name) {
      const newProject = new Project(name);
      currentLibrary.projects.push(newProject);

      // Save the updated projects to localStorage
      saveProjectsToLocalStorage();

      // Remove 'aria-selected' from all tabs
      const allTabs = document.querySelectorAll('button[role="tab"]');
      allTabs.forEach((tab) => {
        tab.setAttribute('aria-selected', 'false');
      });

      // Create and select the new tab
      const newTab = createProjectTab(name);
      newTab.setAttribute('aria-selected', 'true');

      // Update the header and draw the task list for the new project
      updateHeader(name);
      setCurrentProject(newProject);
      drawTasklist(currentLibrary, newProject);

      dialog.close(); // Close the dialog after adding the project
      dialog.remove();
    } else {
      console.log('Project name is required.');
    }
  });

  // Add event listener to close the dialog when users click outside
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!isInDialog) {
      dialog.close();
      dialog.remove();
    }
  });

  // Add event listener for the close button to close the dialog
  closeButton.addEventListener('click', () => {
    dialog.close();
    dialog.remove();
  });

  return dialog;
}

export function deleteProjectDialog(name) {
  const dialog = document.createElement('dialog');
  const dialogContent = document.createElement('div');
  dialogContent.style.padding = '1.5rem';
  dialog.appendChild(dialogContent);
  const title = document.createElement('h1');
  title.innerText = 'Delete Project';
  dialogContent.appendChild(title);

  const closeButton = document.createElement('button');
  closeButton.id = 'close-btn';
  closeButton.textContent = '×';
  dialog.appendChild(closeButton);

  const dialogText = document.createElement('p');
  dialogText.innerHTML = `Are you sure you want to delete <span>${name}</span>?<br><br>You cannot undo this operation.`;
  dialogContent.appendChild(dialogText);

  const buttonDiv = document.createElement('div');
  const deleteButton = document.createElement('button');
  deleteButton.style.width = '100%';
  deleteButton.id = 'delete-cta';

  // Create the icon element
  const icon = document.createElement('span');
  icon.className = 'material-icons-rounded';
  icon.innerHTML = 'dangerous';
  // Append the icon to the button first
  deleteButton.appendChild(icon);
  // Add the button text after the icon
  deleteButton.innerHTML += 'Delete Project';
  deleteButton.addEventListener('click', () => {
    deleteProject(name);
    dialog.close();
    dialog.remove();
  });

  buttonDiv.appendChild(deleteButton);
  dialogContent.appendChild(buttonDiv);

  // Event listener to close the dialog when users click outside
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!isInDialog) {
      dialog.close();
      dialog.remove();
    }
  });

  // Add event listener for the close button to close the dialog
  closeButton.addEventListener('click', () => {
    dialog.close();
    dialog.remove();
  });

  return dialog;
}

// Function to save projects to LocalStorage
export function saveProjectsToLocalStorage() {
  const projectsData = currentLibrary.projects.map((project) => ({
    name: project.name,
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
