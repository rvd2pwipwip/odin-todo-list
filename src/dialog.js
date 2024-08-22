export function createDialog() {
  const dialog = document.createElement('dialog');
  // dialog.innerHTML = `
  //   <form action='' method='dialog' id="form"><fieldset><legend>Create Todo<button id='close-btn'>&times;</button></legend><div class='form-item'><label for='title'>Title</label><input id='title' name='title' type='text' required/></div><div class='form-item'><label for='description'>Description</label><input id='description' name='description' type='text'/></div><div class='form-item'><label for='due-date'>Due Date</label><input id='due-date' name='due-date' type='number' min='1' required/></div><div class="custom-select"><select id='priority-status' name='priority-status' required><option value=''>Priority…</option><option value='Low'>Low</option><option value='Medium'>Medium</option><option value='High'>High</option></select><span class="custom-arrow"></span></div><div><button class="add-submit"><i class="material-icons">add</i>Add</button></div></fieldset></form>
  // `;

  const form = document.createElement('form');
  form.setAttribute('action', '');
  form.setAttribute('method', 'dialog');
  form.id = 'form';

  const fieldset = document.createElement('fieldset');

  const legend = document.createElement('legend');
  legend.textContent = 'Create Todo';

  const closeButton = document.createElement('button');
  closeButton.id = 'close-btn';
  closeButton.textContent = '×';
  legend.appendChild(closeButton);

  fieldset.appendChild(legend);

  const formItems = [
    { label: 'Title', id: 'title', type: 'text' },
    { label: 'Description', id: 'description', type: 'text', 
      // required: true 
    },
    {
      label: 'Due Date',
      id: 'due-date',
      type: 'number',
      min: '1',
      // required: true,
    },
  ];

  formItems.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'form-item';

    const label = document.createElement('label');
    label.setAttribute('for', item.id);
    label.textContent = item.label;

    const input = document.createElement('input');
    input.id = item.id;
    input.name = item.id;
    input.type = item.type;
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
  addButton.id = 'add-submit';
  addButton.innerHTML = 'Add';
  buttonDiv.appendChild(addButton);
  fieldset.appendChild(buttonDiv);

  form.appendChild(fieldset);
  dialog.appendChild(form);

  return dialog;
}
