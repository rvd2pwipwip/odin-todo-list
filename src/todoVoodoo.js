import { v4 as uuidv4 } from 'uuid';

function generateUUID() {
  return uuidv4();
}

class Task {
  constructor(title, description, dueDate, priority = 'Low', done = false, id = null) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.done = done;
    // Only generate a new UUID if no ID is provided
    this.id = id || generateUUID();
  }
  info() {
    return `${this.title} is due on ${this.dueDate}`;
  }
  toggleStatus() {
    this.done = !this.done;
  }
}

class Project {
  constructor(name, id = null) {
    // Only generate a new UUID if no ID is provided
    this.id = id || generateUUID();
    this.name = name;
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }
}

class ProjectLibrary {
  constructor(projects = []) {
    this.projects = projects;
  }
  addProject(project) {
    this.projects.push(project);
  }
}
export { Task, Project, ProjectLibrary };
