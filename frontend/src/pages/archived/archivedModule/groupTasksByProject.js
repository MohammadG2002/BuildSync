const groupTasksByProject = (tasks) => {
  return tasks.reduce((acc, task) => {
    const projectName = task.projectName;
    if (!acc[projectName]) {
      acc[projectName] = [];
    }
    acc[projectName].push(task);
    return acc;
  }, {});
};

export default groupTasksByProject;
