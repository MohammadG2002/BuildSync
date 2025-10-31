const calculateProgress = (project) => {
  return project.totalTasks > 0
    ? Math.round((project.completedTasks / project.totalTasks) * 100)
    : 0;
};

export default calculateProgress;
