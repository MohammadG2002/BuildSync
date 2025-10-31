// Keyboard shortcuts data
const shortcutsData = [
  {
    category: "Navigation",
    items: [
      { keys: ["G", "D"], description: "Go to Dashboard" },
      { keys: ["G", "W"], description: "Go to Workspaces" },
      { keys: ["G", "M"], description: "Go to Members" },
      { keys: ["G", "S"], description: "Go to Settings" },
    ],
  },
  {
    category: "Search & Actions",
    items: [
      { keys: ["Ctrl/Cmd", "K"], description: "Open global search" },
      {
        keys: ["Ctrl/Cmd", "N"],
        description: "Create new (context-dependent)",
      },
      { keys: ["Ctrl/Cmd", "E"], description: "Edit selected item" },
      { keys: ["Ctrl/Cmd", "S"], description: "Save changes" },
      { keys: ["Esc"], description: "Close modal/dialog" },
    ],
  },
  {
    category: "Task Management",
    items: [
      { keys: ["T", "N"], description: "New task" },
      { keys: ["T", "C"], description: "Complete task" },
      { keys: ["T", "E"], description: "Edit task" },
      { keys: ["T", "D"], description: "Delete task" },
    ],
  },
  {
    category: "Lists & Navigation",
    items: [
      { keys: ["↑/↓"], description: "Navigate list items" },
      { keys: ["Enter"], description: "Open/Select item" },
      { keys: ["Tab"], description: "Next field" },
      { keys: ["Shift", "Tab"], description: "Previous field" },
    ],
  },
  {
    category: "General",
    items: [
      { keys: ["Shift", "?"], description: "Show this help" },
      { keys: ["Ctrl/Cmd", "\\\\"], description: "Toggle sidebar" },
      { keys: ["Ctrl/Cmd", "B"], description: "Toggle theme (dark/light)" },
    ],
  },
];

export default shortcutsData;
