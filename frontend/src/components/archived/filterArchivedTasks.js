const filterArchivedTasks = (tasks, searchQuery, filterProject) => {
  return tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.projectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject =
      filterProject === "all" || task.projectId === filterProject;

    return matchesSearch && matchesProject;
  });
};

export default filterArchivedTasks;
