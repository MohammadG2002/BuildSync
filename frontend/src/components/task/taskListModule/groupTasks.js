export const groupTasks = (tasks, groupBy) => {
  if (groupBy === "none") {
    return { "All Tasks": tasks };
  }

  const grouped = {};
  tasks.forEach((task) => {
    const key = task[groupBy];
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(task);
  });

  return grouped;
};

export const getGroupTitle = (key, groupBy) => {
  if (groupBy === "status") {
    return key.replace("_", " ").toUpperCase();
  }
  if (groupBy === "priority") {
    return `${key.toUpperCase()} PRIORITY`;
  }
  return key;
};
