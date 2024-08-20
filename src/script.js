// import Project from './project';

// const main = new Project();

import { createDialog } from './dialog.js';

document.addEventListener('DOMContentLoaded', function() {
  // Create and insert the dialog content
  const dialog = createDialog();
  document.getElementById('dialog-placeholder').appendChild(dialog);

  // Add event listener for the create button to show the dialog
  const createButton = document.getElementById('create-cta');
  createButton.addEventListener('click', () => {
    dialog.showModal();
  });

  // Add event listener for the close button to close the dialog
  const closeButton = dialog.querySelector('#close-btn');
  closeButton.addEventListener('click', () => {
    dialog.close();
  });
});
