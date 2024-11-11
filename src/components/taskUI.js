import { currentLibrary } from '../script';

export const drawTaskCard = (task, tasklist) => {
  const card = document.createElement('div');
  card.className = `card priority-${task.priority.toLowerCase()}`;
  card.id = task.id;

  const done = document.createElement('input');
  done.setAttribute('type', 'checkbox');
  done.className = 'done';
  done.checked = task.done;

  const title = document.createElement('label');
  title.className = 'title';
  title.textContent = task.title;

  const titleDone = document.createElement('div');
  titleDone.className = 'title-done';
  titleDone.append(done, title);

  const dueDate = document.createElement('p');
  dueDate.className = 'due-date';
  dueDate.textContent = task.dueDate;

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
