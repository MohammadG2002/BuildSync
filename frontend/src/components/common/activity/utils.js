// Format timestamp helper
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

// Filter activities by type
export const filterActivities = (activities, filter) => {
  if (filter === "all") return activities;
  if (filter === "tasks")
    return activities.filter((a) => a.type.startsWith("task_"));
  if (filter === "projects")
    return activities.filter((a) => a.type.startsWith("project_"));
  if (filter === "members")
    return activities.filter((a) => a.type.includes("member_"));
  if (filter === "files")
    return activities.filter((a) => a.type.includes("file_"));
  return activities;
};
