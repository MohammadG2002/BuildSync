/**
 * Calculate task statistics from task list
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Task statistics with total, todo, inProgress, inReview, and done counts
 */
export const calculateTaskStats = (tasks) => {
  return {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    inReview: tasks.filter((t) => t.status === "review").length,
    done: tasks.filter((t) => t.status === "completed").length,
  };
};
