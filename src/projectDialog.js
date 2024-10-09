export function addProjectDialog(library) {
  console.log(`will add project to ${library}`);
  const dialog = document.createElement('dialog');

  const form = document.createElement('form');
  form.setAttribute('action', '');
  form.setAttribute('method', 'dialog');
  form.id = 'form';

  const fieldset = document.createElement('fieldset');

  const legend = document.createElement('legend');
  legend.textContent = 'New Project';

  const closeButton = document.createElement('button');
  closeButton.id = 'close-btn';
  closeButton.textContent = '×';
  legend.appendChild(closeButton);

  fieldset.appendChild(legend);

  const formItems = [{ label: 'Project Name', id: 'name', type: 'text' }];

  formItems.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'form-item';

    const label = document.createElement('label');
    label.setAttribute('for', item.id);
    label.textContent = item.label;

    let input;

    input = document.createElement('input');
    input.type = item.type;

    input.id = item.id;
    input.name = item.id;

    if (item.required) input.required = true;
    if (item.min) input.min = item.min;

    div.appendChild(label);
    div.appendChild(input);
    fieldset.appendChild(div);
  });

  const buttonDiv = document.createElement('div');
  const addButton = document.createElement('button');
  addButton.style.width = '100%';
  addButton.id = 'add-submit-cta';

  // Create the icon element
  const icon = document.createElement('span');
  icon.className = 'material-icons-rounded';
  icon.innerHTML = 'add';
  // Append the icon to the button first
  addButton.appendChild(icon);
  // Add the button text after the icon
  addButton.innerHTML += 'Add Project';

  buttonDiv.appendChild(addButton);
  fieldset.appendChild(buttonDiv);

  form.appendChild(fieldset);
  dialog.appendChild(form);

  return dialog;
}
