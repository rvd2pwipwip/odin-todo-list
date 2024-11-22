import { currentLibrary } from '../script';

export function saveProjectsToLocalStorage() {
  // currentLibrary parameter or import?
  const projectsData = currentLibrary.projects.map((project) => ({
    name: project.name,
    id: project.id,
    tasks: project.tasks.map((task) => ({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      done: task.done,
      id: task.id,
    })),
  }));

  localStorage.setItem('projects', JSON.stringify(projectsData));
}

export function deleteProjectData(projectId) {
  currentLibrary.deleteProject(projectId);
  // Update localStorage with the modified projects array
  localStorage.setItem('projects', JSON.stringify(currentLibrary.projects));
}

export function updateProjectName(project, newName) {
  project.name = newName;
}
