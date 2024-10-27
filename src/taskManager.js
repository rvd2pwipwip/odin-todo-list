import { Task } from './todoVoodoo.js';

export function createTask(title, description, dueDate, priority, currentProject, currentLibrary) {
  const today = getTodayDateFormatted();
  priority = !priority ? 'Low' : priority;
  dueDate = !dueDate ? today : dueDate;
  const newTask = new Task(title, description, dueDate, priority);

  // Add new task to current project or unassigned
  if (currentProject) {
    currentProject.tasks.push(newTask);
  } else {
    const unassignedProject = currentLibrary.projects.find(
      (project) => project.name === 'Unassigned'
    );
    unassignedProject.tasks.push(newTask);
  }

  // Update localStorage
  localStorage.setItem('projects', JSON.stringify(currentLibrary.projects));
  return newTask;
}

const drawTasklist = (projectLibrary, project = null) => {
  const header = document.getElementById('main-header');
  const tasklist = document.getElementById('tasklist');
  tasklist.innerHTML = '';

  if (project) {
    if (project.tasks.length === 0) {
      drawEmptyProject(project.name);
    }
    // header.innerText = project.name;
    project.tasks.forEach((task) => {
      createTaskCard(task, tasklist);
    });
  } else {
    // header.innerText = 'All tasks';
    projectLibrary.projects.forEach((project) => {
      project.tasks.forEach((task) => {
        createTaskCard(task, tasklist);
      });
    });
  }
};

const createTaskCard = (task, tasklist) => {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.className = 'title';
  title.textContent = task.title;

  const done = document.createElement('input');
  done.setAttribute('type', 'checkbox');
  done.className = 'done';
  done.checked = task.done;

  const dueDate = document.createElement('p');
  dueDate.className = 'due-date';
  dueDate.textContent = task.dueDate;

  card.append(done, title, dueDate);
  tasklist.append(card);
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

export default drawTasklist;
