import './styles.css';

const drawTasklist = (project) => {
  const tasklist = document.getElementById('tasklist');
  tasklist.innerHTML = '';

  project.forEach((task) => {
    const card = document.createElement('div');
    card.className.add('card');

    const title = document.createElement('h3');
    title.className.add('title');
    title.textContent = task.title;

    const done = document.createElement('p');
    done.className.add('done');
    done.textContent = task.done;

    const dueDate = document.createElement('p');
    dueDate.className.add('due-date');
    dueDate.textContent = task.dueDate;

    card.append(done, title, dueDate);
    tasklist.append(card);
  });
};

export default drawTasklist;
