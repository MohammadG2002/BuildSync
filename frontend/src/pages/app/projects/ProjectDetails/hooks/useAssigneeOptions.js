import { useMemo } from "react";

/**
 * Custom hook for managing assignee options based on project and workspace members
 */
export const useAssigneeOptions = (project, members, currentUserId) => {
  const projectMemberIds = useMemo(
    () =>
      new Set(
        (project?.members || []).map(
          (m) => m?.user?._id || m?.user || m?.id || m?._id,
        ),
      ),
    [project],
  );

  const workspaceMembersById = useMemo(() => {
    const map = new Map();
    (members || []).forEach((m) => {
      if (m?.id) map.set(m.id, m);
    });
    return map;
  }, [members]);

  const projectAssigneeOptions = useMemo(() => {
    return Array.from(projectMemberIds)
      .map((id) => workspaceMembersById.get(id))
      .filter(Boolean);
  }, [projectMemberIds, workspaceMembersById]);

  const getEditAssigneeOptions = (selectedTask) => {
    if (!selectedTask) return projectAssigneeOptions;
    const map = new Map(projectAssigneeOptions.map((m) => [m.id, m]));
    const assigned = Array.isArray(selectedTask?.assignedTo)
      ? selectedTask.assignedTo
      : [];
    assigned.forEach((a) => {
      const id = a?._id || a?.id || a;
      if (!id) return;
      if (!map.has(id)) {
        map.set(id, {
          id,
          name: a?.name || "Unknown User",
          email: a?.email || "",
        });
      }
    });
    return Array.from(map.values());
  };

  return {
    projectAssigneeOptions,
    getEditAssigneeOptions,
  };
};
