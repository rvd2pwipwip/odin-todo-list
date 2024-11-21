import { currentLibrary } from '../script.js';
import { getTaskById, updateTask } from '../services/taskManager.js';
import { drawTasklist } from './taskUI.js';

export function editTaskDialog(taskId, projectId) {
  const task = getTaskById(taskId);
  // Remove existing dialog if it exists
  const existingDialog = document.querySelector('dialog');
  if (existingDialog) {
    existingDialog.remove();
  }

  const dialog = document.createElement('dialog');

  const form = document.createElement('form');
  form.reset();
  form.setAttribute('method', 'dialog');
  form.id = 'form';

  const fieldset = document.createElement('fieldset');

  const legend = document.createElement('legend');
  legend.textContent = 'Edit Task';

  const closeButton = document.createElement('button');
  closeButton.id = 'close-btn';
  closeButton.textContent = '×';
  form.appendChild(closeButton);

  fieldset.appendChild(legend);

  const formItems = [
    {
      label: 'Title',
      id: 'title',
      type: 'text',
      required: true,
      maxlength: '60',
      value: task.title,
    },
    {
      label: 'Description',
      id: 'description',
      type: 'textarea',
      maxlength: '200',
      value: task.description,
      // required: true
    },
    {
      label: 'Due Date',
      id: 'due-date',
      type: 'date',
      value: task.dueDate,
      // required: true,
    },
  ];

  let formInputs = []; //form inputs will be pushed here so we can check if there values are changed later

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
    input.value = item.value;

    if (item.maxlength) input.maxLength = item.maxlength;

    if (item.required) input.required = true;
    if (item.min) input.min = item.min;

    formInputs.push(input);

    div.appendChild(label);
    div.appendChild(input);
    fieldset.appendChild(div);
  });

  const selectDiv = document.createElement('div');
  selectDiv.className = 'custom-select';

  const selectComboDiv = document.createElement('div');
  selectComboDiv.id = 'select-combo-div';

  const select = document.createElement('select');
  select.id = 'priority';
  select.name = 'priority';
  // select.required = true;
  const priorityLabel = document.createElement('label');
  priorityLabel.setAttribute('for', select.id);
  priorityLabel.textContent = select.id;

  const options = [
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

  select.value = task.priority;
  formInputs.push(select);

  selectDiv.appendChild(select);
  selectDiv.appendChild(document.createElement('span')).className =
    'custom-arrow';
  selectComboDiv.append(priorityLabel, selectDiv);
  fieldset.appendChild(selectComboDiv);

  const buttonDiv = document.createElement('div');
  const updateTaskButton = document.createElement('button');
  updateTaskButton.type = 'button'; // Ensure updateButton is of type button
  updateTaskButton.style.width = '100%';
  updateTaskButton.id = 'update-task-cta';
  updateTaskButton.disabled = true;

  // Create the icon element
  const icon = document.createElement('span');
  icon.className = 'material-icons-rounded';
  icon.innerHTML = 'save';
  // Append the icon to the button first
  updateTaskButton.appendChild(icon);
  // Add the button text after the icon
  updateTaskButton.innerHTML += 'Update Task';

  buttonDiv.appendChild(updateTaskButton);
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

  // enable updateTaskButton only when an input value is modified
  // Function to enable the button
  function enableUpdateButton() {
    updateTaskButton.disabled = false;
  }
  // Add event listeners to each input element
  formInputs.forEach((input) => {
    input.addEventListener('input', enableUpdateButton);
  });

  updateTaskButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default form submission

    const updatedAttributes = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      dueDate: document.getElementById('due-date').value,
      priority: document.getElementById('priority').value,
    };

    updateTask(task.id, updatedAttributes);

    // null if All Tasks to redraw all tasks instead of tasks's project
    projectId = document.getElementById('main-header').innerText === 'All Tasks' ? null : projectId;

    drawTasklist(currentLibrary, projectId);

    dialog.close();
    dialog.remove();
  });

  return dialog;
}
