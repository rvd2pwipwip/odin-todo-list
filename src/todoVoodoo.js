import { v4 as uuidv4 } from 'uuid';

function generateUUID() {
  return uuidv4();
}

class Task {
  constructor(
    title,
    description,
    dueDate,
    priority = 'Low',
    done = false,
    id = null
  ) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.done = done;
    // Only generate a new task UUID if no ID is provided
    this.id = id || generateUUID();
  }
}

class Project {
  constructor(name, id = null) {
    // Only generate a new project UUID if no ID is provided
    this.id = id || generateUUID();
    this.name = name;
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }
  deleteTask(task) {
    this.tasks = this.tasks.filter((t) => t !== task);
  }
}

class ProjectLibrary {
  constructor(projects = []) {
    this.projects = projects;
  }

  addProject(project) {
    this.projects.push(project);
  }
  deleteProject(projectId) {
    this.projects = this.projects.filter((p) => p.id !== projectId);
  }
}
export { Task, Project, ProjectLibrary };
