import { currentLibrary } from '../script';
import { updateTask } from '../services/taskManager';
import { formatTaskDate, getTodayDateFormatted } from '../utils/dateUtils';
import { taskInfoDialog } from './taskInfoDialog';

export const drawTaskCard = (task, tasklist) => {
  const card = document.createElement('div');
  card.className = `card priority-${task.priority.toLowerCase()}`;
  card.id = task.id;

  const checkboxInput = document.createElement('input');
  checkboxInput.setAttribute('type', 'checkbox');
  checkboxInput.id = task.title; //same as title's 'for' value to enable label click
  checkboxInput.className = 'done';
  checkboxInput.checked = task.done;

  // custom checkbox with material icons
  const customCheckbox = document.createElement('span');
  customCheckbox.className = 'material-icons-rounded';
  customCheckbox.textContent = checkboxInput.checked
    ? 'check_circle'
    : 'radio_button_unchecked'; // Initial state

  const label = document.createElement('label');
  label.setAttribute('for', task.title); // same as checkbox id to enable label click
  // to style pseudo-element text content (no line-through on span text material icon)
  label.setAttribute('data-text', task.title);
  label.className = 'title';
  label.append(checkboxInput, customCheckbox);

  // append the label's text content after the custom checkbox
  label.append(document.createTextNode(task.title));

  // toggle icon and done status
  label.addEventListener('click', (e) => {
    e.stopPropagation(); // don't bubble up to card click event
    customCheckbox.textContent = checkboxInput.checked
      ? 'check_circle'
      : 'radio_button_unchecked';
    task.done = checkboxInput.checked ? true : false;
    const updatedDone = checkboxInput.checked
      ? { done: true }
      : { done: false };
    updateTask(task.id, updatedDone);
  });

  const titleDone = document.createElement('div');
  titleDone.className = 'title-done';
  // titleDone.append(checkboxInput, label);
  titleDone.append(label);

  const dueDate = document.createElement('p');
  dueDate.className = 'due-date';
  dueDate.textContent = formatTaskDate(task.dueDate);

  card.append(titleDone, dueDate);
  tasklist.append(card);
};

// set click event on container of tasks for event delegation
tasklist.addEventListener('click', (e) => {
  const card = e.target.closest('.card'); // delegate to specific task card
  const taskInfo = taskInfoDialog(card.id);
  document.getElementById('dialog-placeholder').appendChild(taskInfo);
  taskInfo.showModal();
});

export const drawTasklist = (projectLibrary, projectId = null) => {
  const tasklist = document.getElementById('tasklist');
  tasklist.innerHTML = '';

  const project = currentLibrary.projects.find((proj) => proj.id === projectId);

  if (project) {
    if (project.tasks.length === 0) {
      drawEmptyProject(project.name);
    }
    project.tasks.forEach((task) => {
      drawTaskCard(task, tasklist, projectId);
    });
    // draw all tasks when no project is selected
  } else {
    projectLibrary.projects.forEach((project) => {
      project.tasks.forEach((task) => {
        drawTaskCard(task, tasklist);
      });
    });
  }
};

const drawEmptyProject = (name) => {
  const title = document.createElement('h1');
  title.innerText = `${name} has no assigned tasks yet.`;
  tasklist.append(title);

  const emptyImage = document.createElement('img');
  emptyImage.setAttribute('src', './img/empty.png');
  emptyImage.setAttribute('alt', 'empty list');
  tasklist.append(emptyImage);

  const subtitle = document.createElement('h1');
  subtitle.innerText = 'Tasks added to this project will appear here.';
  tasklist.append(subtitle);
};
