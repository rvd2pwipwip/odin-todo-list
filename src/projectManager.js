

export function deleteProjectData(projectId, currentLibrary) {
  const projectIndex = currentLibrary.projects.findIndex(project => project.id === projectId);
  if (projectIndex !== -1) {
    currentLibrary.projects.splice(projectIndex, 1);
    localStorage.setItem('projects', JSON.stringify(currentLibrary.projects));
  } else {
    console.error('Project not found');
  }
}