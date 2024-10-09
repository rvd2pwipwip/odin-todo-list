import { Task, Project, ProjectLibrary } from './todoVoodoo.js';
import { currentProject, currentLibrary } from './script.js';
import drawTasklist from './tasklist.js';


export function addTaskDialog() {
  console.log(`will add task to ${currentProject}`);
  const selectedProject = currentLibrary.projects.find(
    (project) => project.projectName === currentProject
  );
  console.log(selectedProject);
  const dialog = document.createElement('dialog');

  const form = document.createElement('form');
  form.setAttribute('action', '');
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
      // TODO remove dialog from html on close
      dialog.close();
    }
  });

  function addTask() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let dueDate = document.getElementById('due-date').value;
    let priority = document.getElementById('priority').value;

    // Get today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

    // TODO: check for mandatory task parameters (name)
    if (true) {
      priority = !priority ? 'Low' : priority;
      dueDate = !dueDate ? formattedDate : dueDate;
      const newTask = new Task(title, description, dueDate, priority);

      if (!selectedProject || !selectedProject.tasks) {
        console.error(
          'No current project selected or tasks array is undefined'
        );
        return;
      }

      // Add the new task to the current project
      selectedProject.tasks.push(newTask);

      // Update localStorage
      const updatedData = { projects: currentLibrary };
      localStorage.setItem('projects', JSON.stringify(updatedData));

      // allTasks.tasks.push(newTask);
      console.log(currentLibrary);
      drawTasklist(currentLibrary, currentProject);
    }
  }

  // Add event listener for the add button to push the new todo
  addButton.addEventListener('click', () => {
    addTask();
  });

  return dialog;
}
