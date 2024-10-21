// Function to get today's date as a YYYY-MM-DD string
export function getTodayDateFormatted() {
  return formatDate(new Date());
}

// Function to format a date as YYYY-MM-DD
export function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Function to parse a YYYY-MM-DD string to a Date object
export function parseDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return new Date(year, month - 1, day);
}

// Filter today's tasks
export function filterTodayTasks(library) {
  const today = getTodayDateFormatted();

  return library.projects.flatMap((project) =>
    project.tasks.filter((task) => {
      return task.dueDate === today;
    })
  );
}

// Get date range for the week
function getWeekDateRange() {
  const today = new Date();
  const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  return {
    start: formatDate(today),
    end: formatDate(sevenDaysLater)
  };
}

// Filter tasks for the next 7 days
export function filterWeekTasks(library) {
  const { start, end } = getWeekDateRange();
  return library.projects.flatMap((project) =>
    project.tasks.filter((task) => {
      return task.dueDate >= start && task.dueDate <= end;
    })
  );
}