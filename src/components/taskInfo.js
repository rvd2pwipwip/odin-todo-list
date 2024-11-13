import { currentLibrary } from '../script.js';

export function taskInfo(taskId) {
  // Remove existing dialog if it exists
  const existingDialog = document.querySelector('dialog');
  if (existingDialog) {
    existingDialog.remove();
  }

  // Find the project containing the task
  const project = currentLibrary.projects.find(proj => 
    proj.tasks.some(task => task.id === taskId)
  );

  if (!project) {
    console.error('Task not found');
    return null;
  }

  // Find the task within the project
  const task = project.tasks.find(task => task.id === taskId);

  if (!task) {
    console.error('Task not found');
    return null;
  }

  // Display task attributes in a dialog
  console.log(`Task Title: ${task.title}`);
  console.log(`Description: ${task.description}`);
  console.log(`Due Date: ${task.dueDate}`);
  console.log(`Priority: ${task.priority}`);

  const dialog = document.createElement('dialog');

  const dialogTitle = document.createElement('header');
  dialogTitle.textContent = task.name;

  const closeButton = document.createElement('button');
  closeButton.id = 'close-btn';
  closeButton.textContent = '×';
  dialog.appendChild(closeButton);

  

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
  dialog.appendChild(selectDiv);

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

  addButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default form submission
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;

    if (title) {
      createTask(
        title,
        description,
        dueDate,
        priority,
        currentProjectId,
        currentLibrary
      );

      drawTasklist(currentLibrary, currentProjectId);
    }

    dialog.close();
    dialog.remove();
  });

  return dialog;
}
