// todoVoodoo.js
class Task {
  constructor(title, description, dueDate, priority = 'Low', done = false) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.done = done;
  }
  info() {
    return `${this.title} is due on ${this.dueDate}`;
  }
  toggleStatus() {
    this.done = !this.done;
  }
}

class Project {
  constructor(projectName, tasks = []) {
    this.projectName = projectName;
    this.tasks = tasks;
  }
  addTask(task) {
    this.tasks.push(task);
  }
}

// Create a projectLibrary to store all projects
class ProjectLibrary {
  constructor(projects = []) {
    this.projects = projects;
  }
  addProject(project) {
    this.projects.push(project);
  }
}
export { Task, Project, ProjectLibrary };
