import { currentLibrary } from '../script';
import { Task } from '../todoVoodoo.js';
import { getTodayDateFormatted } from '../utils/dateUtils.js';

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

export function getTaskById(taskId) {
  for (const project of currentLibrary.projects) {
    for (const task of project.tasks) {
      if (task.id === taskId) {
        return task;
      }
    }
  }
  return null; // Return null if the task is not found
}

export function updateTask(taskId, updatedAttributes, projectId = null) {
  // Find the project containing the task
  const project = projectId
    ? currentLibrary.projects.find((proj) => proj.id === projectId)
    : currentLibrary.projects.find((proj) =>
        proj.tasks.some((task) => task.id === taskId)
      );

  if (!project) {
    console.error('Project not found');
    return null;
  }

  // Find the task within the project
  const task = project.tasks.find((task) => task.id === taskId);

  if (!task) {
    console.error('Task not found');
    return null;
  }

  // Update task attributes
  Object.keys(updatedAttributes).forEach((key) => {
    if (task.hasOwnProperty(key)) {
      task[key] = updatedAttributes[key];
    }
  });

  // Update localStorage
  localStorage.setItem('projects', JSON.stringify(currentLibrary.projects));

  return task;
}

export function deleteTaskData(taskId) {
  // Iterate over each project in the current library
  for (const project of currentLibrary.projects) {
    // Find the index of the task with the specified ID
    const taskIndex = project.tasks.findIndex(task => task.id === taskId);

    // If the task is found, remove it
    if (taskIndex !== -1) {
      project.tasks.splice(taskIndex, 1);
      
      // Update localStorage with the modified projects array
      localStorage.setItem('projects', JSON.stringify(currentLibrary.projects));
      
      return; // Exit the function once the task is deleted
    }
  }

  console.error('Task not found');
}
