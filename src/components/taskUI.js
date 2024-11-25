import { currentLibrary } from '../script';
import { updateTask, deleteTaskData } from '../services/taskManager';
import { formatTaskDate } from '../utils/dateUtils';
import { UIState } from '../utils/uiStateManager';
import { taskInfoDialog } from './taskInfoDialog';
import { filterTodayTasks, filterWeekTasks } from '../utils/dateUtils';

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
  titleDone.append(label);

  const taskInfoBtn = document.createElement('p');
  const infoBtnSpan = document.createElement('span');
  infoBtnSpan.className = 'material-icons-rounded';
  infoBtnSpan.innerText = 'info_outline';
  taskInfoBtn.id = task.id;

  taskInfoBtn.append(infoBtnSpan);

  const dueDate = document.createElement('p');
  dueDate.className = 'due-date';
  dueDate.textContent = formatTaskDate(task.dueDate);

  const taskDeleteBtn = document.createElement('p');
  const deleteBtnSpan = document.createElement('span');
  deleteBtnSpan.className = 'material-icons-rounded';
  deleteBtnSpan.innerText = 'delete_outline';
  taskDeleteBtn.id = task.id;

  taskDeleteBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // don't bubble up to card click event

    const project = currentLibrary.projects.find((p) =>
      p.tasks.some((t) => t.id === task.id)
    );

    deleteTaskData(task);

    let projectId;

    if (UIState.selectedProjectId) {
      if ((UIState.selectedProjectId === 'today-tab')) {
        const todayTasks = filterTodayTasks(currentLibrary);

        const todayProjects = currentLibrary.projects
          .map((project) => ({
            name: project.name,
            tasks: project.tasks.filter((task) => todayTasks.includes(task)),
          }))
          .filter((project) => project.tasks.length > 0);
        drawTasklist({ projects: todayProjects }, null);
        return;
      }
      if ((UIState.selectedProjectId === 'week-tab')) {
        const weekTasks = filterWeekTasks(currentLibrary);
        const weekProjects = currentLibrary.projects
          .map((project) => ({
            name: project.name,
            tasks: project.tasks.filter((task) => weekTasks.includes(task)),
          }))
          .filter((project) => project.tasks.length > 0);
        drawTasklist({ projects: weekProjects }, null);
        return;
      }
      projectId = project.id;
    } else {
      projectId = null;
    }

    drawTasklist(currentLibrary, projectId);
  });

  taskDeleteBtn.append(deleteBtnSpan);

  card.append(titleDone, taskInfoBtn, dueDate, taskDeleteBtn);
  tasklist.append(card);
};

// set click event on container of tasks for event delegation
tasklist.addEventListener('click', (e) => {
  const card = e.target.closest('.card'); // delegate to specific task card
  if (!card) {
    // If no card is found, exit the function
    return;
  }
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
  const emptyProject = document.createElement('div');
  emptyProject.id = 'empty-project';
  const projectName = document.createElement('h1');
  projectName.id = 'project-name';
  projectName.innerText = name;
  const title = document.createElement('h2');
  title.innerText = 'has no assigned tasks yet.';
  const header = document.createElement('header');
  header.id = 'empty-project-header';
  header.append(projectName, title);

  const emptyImage = document.createElement('img');
  emptyImage.setAttribute('src', './img/empty.png');
  emptyImage.setAttribute('alt', 'empty list');

  const subtitle = document.createElement('h2');
  subtitle.innerText = 'Tasks added to this project will appear here.';
  emptyProject.append(header, emptyImage, subtitle);
  tasklist.append(emptyProject);
};
