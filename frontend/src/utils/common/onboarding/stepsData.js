// Onboarding steps data
const stepsData = [
  {
    id: "welcome",
    title: "Welcome to BuildSync! 🎉",
    description:
      "Let's take a quick tour to help you get started with managing your projects efficiently.",
    target: null,
    position: "center",
  },
  {
    id: "workspaces",
    title: "Workspaces",
    description:
      "Switch between different workspaces to organize your projects. Click here to view all your workspaces.",
    target: "workspace-selector",
    position: "bottom",
  },
  {
    id: "search",
    title: "Global Search",
    description: "Quickly find projects, tasks, and members using Cmd/Ctrl + K",
    target: "global-search",
    position: "bottom",
  },
  {
    id: "notifications",
    title: "Notifications",
    description:
      "Stay updated with real-time notifications about tasks, mentions, and project updates.",
    target: "notification-bell",
    position: "bottom",
  },
  {
    id: "theme",
    title: "Dark Mode",
    description:
      "Toggle between light and dark themes for comfortable viewing at any time.",
    target: "theme-toggle",
    position: "bottom",
  },
  {
    id: "sidebar",
    title: "Navigation",
    description:
      "Access all your workspaces, projects, members, and settings from the sidebar.",
    target: "sidebar",
    position: "right",
  },
  {
    id: "shortcuts",
    title: "Keyboard Shortcuts",
    description:
      "Press Shift + ? to view all available keyboard shortcuts and boost your productivity.",
    target: "shortcuts-button",
    position: "left",
  },
  {
    id: "complete",
    title: "You're All Set! 🚀",
    description:
      "You're ready to start managing your projects. You can restart this tour anytime from Settings.",
    target: null,
    position: "center",
  },
];

export default stepsData;
