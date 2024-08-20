class Todo {
  constructor(title, description, dueDate, priority, done = false) {
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

export default Todo;
