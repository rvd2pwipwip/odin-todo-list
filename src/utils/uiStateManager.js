export const UIState = {
  selectedProjectId: null,

  setSelectedProject(projectId) {
    this.selectedProjectId = projectId;
    this.updateProjectTabs();
  },

  updateProjectTabs() {
    // Remove selected state from all tabs
    document.querySelectorAll('button[role="tab"]').forEach((tab) => {
      tab.setAttribute('aria-selected', 'false');
    });

    // Set selected state for current project
    if (this.selectedProjectId) {
      const selectedTab = document.querySelector(
        `button[data-id="${this.selectedProjectId}"]`
      );
      if (selectedTab) {
        selectedTab.setAttribute('aria-selected', 'true');
      }
    }
  },

  updateHeader(headerText) {
    document.getElementById('main-header').innerText = headerText;
  },

  // Manage add task button state
  setAddTaskButtonState(enabled) {
    const addTaskButton = document.getElementById('create-cta');
    addTaskButton.disabled = !enabled;
    addTaskButton.classList.toggle('disabled', !enabled);
  },
};
