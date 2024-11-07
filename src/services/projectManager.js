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

  console.log('currentLibrary', currentLibrary);
  console.log('projectsData:', projectsData);

  localStorage.setItem('projects', JSON.stringify(projectsData));
}

export function deleteProjectData(projectId, currentLibrary) {
  const projectIndex = currentLibrary.projects.findIndex(
    (project) => project.id === projectId
  );
  if (projectIndex !== -1) {
    currentLibrary.projects.splice(projectIndex, 1);
    localStorage.setItem('projects', JSON.stringify(currentLibrary.projects));
  } else {
    console.error('Project not found');
  }
}

export function updateProjectName(projectIndex, newName) {
  currentLibrary.projects[projectIndex].name = newName;
}
