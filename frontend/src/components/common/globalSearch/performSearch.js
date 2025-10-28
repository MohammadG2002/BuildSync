// Perform search across all data
const performSearch = (searchQuery, workspaces) => {
  if (!searchQuery.trim()) {
    return { workspaces: [], projects: [], tasks: [], members: [] };
  }

  const query = searchQuery.toLowerCase();

  // Mock data - replace with real search API
  const mockResults = {
    workspaces: workspaces.filter((w) => w.name.toLowerCase().includes(query)),
    projects: [
      {
        id: "1",
        name: "Website Redesign",
        workspace: "Design Team",
        type: "project",
      },
      {
        id: "2",
        name: "Mobile App",
        workspace: "Development",
        type: "project",
      },
    ].filter((p) => p.name.toLowerCase().includes(query)),
    tasks: [
      {
        id: "1",
        title: "Update homepage design",
        project: "Website Redesign",
        type: "task",
      },
      {
        id: "2",
        title: "Fix login bug",
        project: "Mobile App",
        type: "task",
      },
    ].filter((t) => t.title.toLowerCase().includes(query)),
    members: [
      { id: "1", name: "John Doe", role: "Developer", type: "member" },
      { id: "2", name: "Jane Smith", role: "Designer", type: "member" },
    ].filter((m) => m.name.toLowerCase().includes(query)),
  };

  return mockResults;
};

export default performSearch;
