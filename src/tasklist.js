import './styles.css';

const drawTasklist = (projectLibrary, project = null) => {
  const header = document.getElementById('main-header');
  const tasklist = document.getElementById('tasklist');
  tasklist.innerHTML = '';

  if (project) {
    console.log(project);
    header.innerText = project.projectName;
    project.tasks.forEach((task) => {
      createTaskCard(task, tasklist);
    });
  } else {
    header.innerText = 'All tasks';
    projectLibrary.projects.forEach((project) => {
      project.tasks.forEach((task) => {
        createTaskCard(task, tasklist);
      });
    });
  }
};

const createTaskCard = (task, tasklist) => {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.className = 'title';
  title.textContent = task.title;

  const done = document.createElement('input');
  done.setAttribute('type', 'checkbox');
  done.className = 'done';
  done.checked = task.done;

  const dueDate = document.createElement('p');
  dueDate.className = 'due-date';
  dueDate.textContent = task.dueDate;

  card.append(done, title, dueDate);
  tasklist.append(card);
};

export default drawTasklist;
