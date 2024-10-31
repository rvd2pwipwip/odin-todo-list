import { Task } from './todoVoodoo.js';
import { getTodayDateFormatted } from './dateUtils.js';
import { drawTaskCard } from './taskUI.js';
import { currentLibrary } from './script.js';

export function createTask(
  title,
  description,
  dueDate,
  priority,
  currentProjectId,
  currentLibrary
) {
  const project = currentLibrary.projects.find(
    (proj) => proj.id === currentProjectId
  );
  const today = getTodayDateFormatted();
  priority = !priority ? 'Low' : priority;
  dueDate = !dueDate ? today : dueDate;
  const newTask = new Task(title, description, dueDate, priority);

  // Add new task to current project or unassigned
  if (currentProjectId) {
    project.addTask(newTask);
  } else {
    const unassignedProject = currentLibrary.projects.find(
      (project) => project.name === 'Unassigned'
    );
    unassignedProject.addTask(newTask);
  }

  // Update localStorage
  localStorage.setItem('projects', JSON.stringify(currentLibrary.projects));
  return newTask;
}

export const drawTasklist = (projectLibrary, projectId = null) => {
  const tasklist = document.getElementById('tasklist');
  tasklist.innerHTML = '';

  const project = currentLibrary.projects.find(
    (proj) => proj.id === projectId
  );

  if (project) {
    if (project.tasks.length === 0) {
      drawEmptyProject(project.name);
    }
    project.tasks.forEach((task) => {
      drawTaskCard(task, tasklist);
    });
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

export default drawTasklist;
