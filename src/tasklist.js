import './styles.css';

const drawTasklist = (project) => {
  const header = document.getElementById('main-header');
  header.innerText = project.projectName;

  const tasklist = document.getElementById('tasklist');
  tasklist.innerHTML = '';

  project.tasks.forEach((task) => {
    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('h3');
    title.className = 'title';
    title.textContent = task.title;

    const done = document.createElement('input');
    done.setAttribute('type', 'checkbox');
    done.className = 'done';
    done.textContent = task.done;

    const dueDate = document.createElement('p');
    dueDate.className = 'due-date';
    dueDate.textContent = task.dueDate;

    card.append(done, title, dueDate);
    tasklist.append(card);
  });
};

export default drawTasklist;
