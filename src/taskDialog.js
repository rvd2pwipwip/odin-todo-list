import { Task } from './todoVoodoo.js';
import { currentLibrary } from './script.js';
import { getTodayDateFormatted } from './dateUtils.js';
import drawTasklist from './tasklist.js';

export function addTaskDialog(currentProject) {
  // Remove existing dialog if it exists
  const existingDialog = document.querySelector('dialog');
  if (existingDialog) {
    existingDialog.remove();
  }

  const dialog = document.createElement('dialog');

  const form = document.createElement('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
  });
  form.setAttribute('method', 'dialog');
  form.id = 'form';

  const fieldset = document.createElement('fieldset');

  const legend = document.createElement('legend');
  legend.textContent = 'New Task';

  const closeButton = document.createElement('button');
  closeButton.id = 'close-btn';
  closeButton.textContent = '×';
  legend.appendChild(closeButton);

  fieldset.appendChild(legend);

  const formItems = [
    { label: 'Title', id: 'title', type: 'text' },
    {
      label: 'Description',
      id: 'description',
      type: 'textarea',
      // required: true
    },
    {
      label: 'Due Date',
      id: 'due-date',
      type: 'date',
      // required: true,
    },
  ];

  formItems.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'form-item';

    const label = document.createElement('label');
    label.setAttribute('for', item.id);
    label.textContent = item.label;

    let input;
    if (item.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 4;
    } else {
      input = document.createElement('input');
      input.type = item.type;
    }

    input.id = item.id;
    input.name = item.id;

    if (item.required) input.required = true;
    if (item.min) input.min = item.min;

    div.appendChild(label);
    div.appendChild(input);
    fieldset.appendChild(div);
  });

  const selectDiv = document.createElement('div');
  selectDiv.className = 'custom-select';

  const select = document.createElement('select');
  select.id = 'priority';
  select.name = 'priority';
  // select.required = true;

  const options = [
    { value: '', text: 'Priority…' },
    { value: 'Low', text: 'Low' },
    { value: 'Medium', text: 'Medium' },
    { value: 'High', text: 'High' },
  ];

  options.forEach((optionData) => {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.textContent = optionData.text;
    select.appendChild(option);
  });

  selectDiv.appendChild(select);
  selectDiv.appendChild(document.createElement('span')).className =
    'custom-arrow';
  fieldset.appendChild(selectDiv);

  const buttonDiv = document.createElement('div');
  const addButton = document.createElement('button');
  addButton.type = 'button'; // Ensure addButton is of type button
  addButton.style.width = '100%';
  addButton.id = 'add-submit-cta';

  // Create the icon element
  const icon = document.createElement('span');
  icon.className = 'material-icons-rounded';
  icon.innerHTML = 'add';
  // Append the icon to the button first
  addButton.appendChild(icon);
  // Add the button text after the icon
  addButton.innerHTML += 'Add Task';

  buttonDiv.appendChild(addButton);
  fieldset.appendChild(buttonDiv);

  form.appendChild(fieldset);
  dialog.appendChild(form);

  // Add event listener for the close button to close the dialog
  closeButton.addEventListener('click', () => {
    dialog.close();
    dialog.remove();
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

  function addTask() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let dueDate = document.getElementById('due-date').value;
    let priority = document.getElementById('priority').value;

    const today = getTodayDateFormatted();

    // check for mandatory task parameters (title)
    if (title) {
      priority = !priority ? 'Low' : priority;
      console.log('Creating task with title:', title);
      dueDate = !dueDate ? today : dueDate;
      const newTask = new Task(title, description, dueDate, priority);

      // Add the new task to the current project
      if (currentProject) {
        currentProject.tasks.push(newTask);
      } else {
        // Find the "Unassigned" project
        let unassignedProject = currentLibrary.projects.find(
          (project) => project.projectName === 'Unassigned'
        );
        unassignedProject.tasks.push(newTask);
      }

      // Reset input fields
      document.getElementById('title').value = '';
      document.getElementById('description').value = '';
      document.getElementById('due-date').value = '';
      document.getElementById('priority').value = '';

      // Update localStorage
      localStorage.setItem('projects', JSON.stringify(currentLibrary.projects));

      const headerText = document.getElementById('main-header').innerText;
      drawTasklist(currentLibrary, currentProject, headerText);
      dialog.close();
    } else {
      console.error('Task title is required');
    }
  }

  // Add event listener for the add button to push the new todo
  addButton.addEventListener('click', addTask);

  return dialog;
}
