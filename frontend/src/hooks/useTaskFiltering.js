import { useMemo } from "react";
import { calculateTaskStats } from "../utils/project";

/**
 * Custom hook for task filtering, stats calculation, and grouping
 */
export const useTaskFiltering = (tasks, filterStatus) => {
  const filteredTasks = useMemo(
    () =>
      filterStatus === "all"
        ? tasks
        : tasks.filter((task) => task.status === filterStatus),
    [tasks, filterStatus],
  );

  const taskStats = useMemo(() => calculateTaskStats(tasks), [tasks]);

  return {
    filteredTasks,
    taskStats,
  };
};
