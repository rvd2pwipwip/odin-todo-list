import { currentLibrary } from '../script';
import { updateTask } from '../services/taskManager';
import { formatTaskDate } from '../utils/dateUtils';

export const drawTaskCard = (task, tasklist) => {
  const card = document.createElement('div');
  card.className = `card priority-${task.priority.toLowerCase()}`;
  card.id = task.id;

  card.addEventListener('click', (e) => {
    const taskId = e.target.id;
    console.log('Clicked element ID:', taskId);
    console.log(e.target);
  });

  const done = document.createElement('input');
  done.setAttribute('type', 'checkbox');
  done.id = task.title; //same as title's 'for' value to enable label click
  done.className = 'done';
  done.checked = task.done;

  // Add event listener to toggle icon and done status
  done.addEventListener('change', () => {
    customCheckbox.textContent = done.checked
      ? 'check_circle'
      : 'radio_button_unchecked';
    task.done = done.checked ? true : false;
    const updatedDone = done.checked ? { done: true } : { done: false };
    updateTask(task.id, updatedDone);
  });

  // custom checkbox with material icons
  const customCheckbox = document.createElement('span');
  customCheckbox.className = 'material-icons-rounded';
  customCheckbox.textContent = done.checked
    ? 'check_circle'
    : 'radio_button_unchecked'; // Initial state

  const title = document.createElement('label');
  title.setAttribute('for', task.title); // same as checkbox id to enable label click
  // to style pseudo-element text content (no line-through on span text material icon)
  title.setAttribute('data-text', task.title);
  title.className = 'title';
  title.append(customCheckbox);

  // append the label's text content after the custom checkbox
  title.append(document.createTextNode(task.title));

  const titleDone = document.createElement('div');
  titleDone.className = 'title-done';
  titleDone.append(done, title);

  const dueDate = document.createElement('p');
  dueDate.className = 'due-date';
  dueDate.textContent = formatTaskDate(task.dueDate);

  card.append(titleDone, dueDate);
  tasklist.append(card);
};

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
