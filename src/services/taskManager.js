import { Task } from '../todoVoodoo.js';
import { getTodayDateFormatted } from '../utils/dateUtils.js';
import { drawTaskCard } from '../components/taskUI.js';
import { currentLibrary } from '../script.js';

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
  if (project) {
    project.addTask(newTask);
  } else {
    currentLibrary.projects
      .find((p) => p.name === 'Unassigned')
      .addTask(newTask);
  }

  // Update localStorage
  localStorage.setItem('projects', JSON.stringify(currentLibrary.projects));
  return newTask;
}
