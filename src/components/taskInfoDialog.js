import { currentLibrary } from '../script.js';
import { formatTaskDate } from '../utils/dateUtils.js';
import { editTaskDialog } from './editTaskDialog.js';
import { UIState } from '../utils/uiStateManager.js';

export function taskInfoDialog(taskId) {
  // Remove existing dialog if it exists
  const existingDialog = document.querySelector('dialog');
  if (existingDialog) {
    existingDialog.remove();
  }

  // Find the project containing the task
  const project = currentLibrary.projects.find((proj) =>
    proj.tasks.some((task) => task.id === taskId)
  );

  if (!project) {
    console.error('Task not found');
    return null;
  }

  // Find the task within the project
  const task = project.tasks.find((task) => task.id === taskId);

  if (!task) {
    console.error('Task not found');
    return null;
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'task-info';

  const closeButton = document.createElement('button');
  closeButton.id = 'close-btn';
  closeButton.textContent = '×';
  dialog.appendChild(closeButton);

  const infoHeader = document.createElement('header');
  infoHeader.id = 'info-header';
  infoHeader.setAttribute('priority', task.priority.toLowerCase());
  dialog.append(infoHeader);

  const dialogTitle = document.createElement('h1');
  dialogTitle.innerHTML += task.title;
  infoHeader.append(dialogTitle);

  const taskInfoContent = document.createElement('div');
  taskInfoContent.id = 'task-info-content';

  const taskDescription = document.createElement('div');
  taskDescription.className = 'task-content-item';
  const descriptionLabel = document.createElement('label');
  descriptionLabel.textContent = 'Description';
  const text = document.createElement('p');
  text.textContent = task.description;
  taskDescription.append(descriptionLabel, text);

  const priorityDisplay = document.createElement('div');
  priorityDisplay.className = 'task-content-item';
  const priorityLabel = document.createElement('label');
  priorityLabel.textContent = 'Priority';
  const priority = document.createElement('p');
  priority.textContent = task.priority;
  priorityDisplay.append(priorityLabel, priority);

  const dueDateDisplay = document.createElement('div');
  dueDateDisplay.className = 'task-content-item';
  const dueDateLabel = document.createElement('label');
  dueDateLabel.textContent = 'Due Date';
  const dueDate = document.createElement('p');
  dueDate.className = 'due-date';
  dueDate.textContent = formatTaskDate(task.dueDate);
  dueDateDisplay.append(dueDateLabel, dueDate);

  const buttonDiv = document.createElement('div');
  const editTaskButton = document.createElement('button');
  editTaskButton.type = 'button'; // Ensure addButton is of type button
  editTaskButton.style.width = '100%';
  editTaskButton.id = 'edit-task-button';

  // Create the icon element
  const icon = document.createElement('span');
  icon.className = 'material-icons-rounded';
  icon.innerHTML = 'edit';
  // Append the icon to the button first
  editTaskButton.appendChild(icon);
  // Add the button text after the icon
  editTaskButton.innerHTML += 'Edit Task';

  // edit task
  editTaskButton.addEventListener('click', () => {
    const editTask = editTaskDialog(taskId, project.id);
    document.getElementById('dialog-placeholder').appendChild(editTask);
    editTask.showModal();
  });

  buttonDiv.appendChild(editTaskButton);

  dueDateDisplay.append(dueDateLabel, dueDate);
  // don't display description item if empty
  task.description
    ? taskInfoContent.append(taskDescription, priorityDisplay, dueDateDisplay)
    : taskInfoContent.append(priorityDisplay, dueDateDisplay);

  const infoDetailsButtonDiv = document.createElement('div');
  infoDetailsButtonDiv.id = 'info-button-div';
  infoDetailsButtonDiv.append(taskInfoContent, buttonDiv);

  dialog.append(infoDetailsButtonDiv);

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

  return dialog;
}
