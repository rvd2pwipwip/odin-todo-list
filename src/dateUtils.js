export function getTodayDateFormatted() {
  // Get today's date
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');

  // Format the date as YYYY-MM-DD
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

// Filter today's tasks
export function filterTodayTasks(library) {
  const today = getTodayDateFormatted();
  return library.projects.flatMap((project) =>
    project.tasks.filter((task) => task.dueDate === today)
  );
}

function getWeekDateRange() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the beginning of the day

  const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  sevenDaysLater.setHours(23, 59, 59, 999); // Set to the end of the 7th day

  return { start: today, end: sevenDaysLater };
}

export function filterWeekTasks(library) {
  const { start, end } = getWeekDateRange();
  const today = getTodayDateFormatted();

  return library.projects.flatMap((project) =>
    project.tasks.filter((task) => {
      if (task.dueDate === today) {
        return true; // Include tasks due today
      }
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0); // Set to the beginning of the day for consistent comparison
      return taskDate > start && taskDate <= end;
    })
  );
}
