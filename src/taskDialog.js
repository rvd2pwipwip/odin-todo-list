export function createTaskDialog() {
  const dialog = document.createElement('dialog');

  const form = document.createElement('form');
  form.setAttribute('action', '');
  form.setAttribute('method', 'dialog');
  form.id = 'form';

  const fieldset = document.createElement('fieldset');

  const legend = document.createElement('legend');
  legend.textContent = 'New Task';

  const closeButton = document.createElement('button');
  closeButton.id = 'close-btn';
  closeButton.textContent = '×';
  legend.appendChild(closeButton);

  fieldset.appendChild(legend);

  const formItems = [
    { label: 'Title', id: 'title', type: 'text' },
    {
      label: 'Description',
      id: 'description',
      type: 'textarea',
      // required: true
    },
    {
      label: 'Due Date',
      id: 'due-date',
      type: 'date',
      // required: true,
    },
  ];

  formItems.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'form-item';

    const label = document.createElement('label');
    label.setAttribute('for', item.id);
    label.textContent = item.label;

    let input;
    if (item.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 4;
    } else {
      input = document.createElement('input');
      input.type = item.type;
    }

    input.id = item.id;
    input.name = item.id;

    if (item.required) input.required = true;
    if (item.min) input.min = item.min;

    div.appendChild(label);
    div.appendChild(input);
    fieldset.appendChild(div);
  });

  const selectDiv = document.createElement('div');
  selectDiv.className = 'custom-select';

  const select = document.createElement('select');
  select.id = 'priority';
  select.name = 'priority';
  // select.required = true;

  const options = [
    { value: '', text: 'Priority…' },
    { value: 'Low', text: 'Low' },
    { value: 'Medium', text: 'Medium' },
    { value: 'High', text: 'High' },
  ];

  options.forEach((optionData) => {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.textContent = optionData.text;
    select.appendChild(option);
  });

  selectDiv.appendChild(select);
  selectDiv.appendChild(document.createElement('span')).className =
    'custom-arrow';
  fieldset.appendChild(selectDiv);

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
  addButton.innerHTML += 'Add Task';

  buttonDiv.appendChild(addButton);
  fieldset.appendChild(buttonDiv);

  form.appendChild(fieldset);
  dialog.appendChild(form);

  return dialog;
}
