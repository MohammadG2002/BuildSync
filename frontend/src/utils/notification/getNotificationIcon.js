const getNotificationIcon = (type) => {
  switch (type) {
    case "workspace_invite":
      return "📨";
    case "task_assigned":
      return "📋";
    case "project_updated":
      return "📁";
    case "member_added":
      return "👥";
    case "mention":
      return "💬";
    case "message":
      return "✉️";
    case "deadline":
      return "⏰";
    case "comment":
      return "💭";
    case "contact_request":
      return "🤝";
    case "contact_accepted":
      return "✅";
    default:
      return "🔔";
  }
};

export default getNotificationIcon;
