import { useEffect, useState, useCallback } from "react";
import { fetchProjectAndTasks } from "../utils/project";

/**
 * Custom hook for fetching and managing project, tasks, and members data
 */
export const useProjectData = (workspaceId, projectId) => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshAll = useCallback(
    () =>
      fetchProjectAndTasks(
        workspaceId,
        projectId,
        setProject,
        setTasks,
        setMembers,
        setLoading,
      ),
    [workspaceId, projectId],
  );

  useEffect(() => {
    refreshAll();
  }, [projectId, refreshAll]);

  return {
    project,
    setProject,
    tasks,
    setTasks,
    members,
    setMembers,
    loading,
    refreshAll,
  };
};
