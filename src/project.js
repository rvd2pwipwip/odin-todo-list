import Todo from './todo.js';

let todos = [];

class Project {
  constructor(projectName, todos) {
    this.projectName = projectName;
    this.todos = todos;
  }
}

export default Project;
