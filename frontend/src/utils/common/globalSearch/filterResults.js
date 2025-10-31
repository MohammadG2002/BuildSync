// Filter results based on active category
const filterResults = (results, activeCategory) => {
  if (activeCategory === "all") {
    return [
      ...results.workspaces.map((r) => ({ ...r, type: "workspace" })),
      ...results.projects.map((r) => ({ ...r, type: "project" })),
      ...results.tasks.map((r) => ({ ...r, type: "task" })),
      ...results.members.map((r) => ({ ...r, type: "member" })),
    ];
  }
  return results[activeCategory].map((r) => ({ ...r, type: activeCategory }));
};

export default filterResults;
