export const drawTaskCard = (task, tasklist) => {
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