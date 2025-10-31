import { Briefcase, FileText, CheckSquare, Users } from "lucide-react";

// Get icon component for result type
const getResultIcon = (type) => {
  switch (type) {
    case "workspace":
      return Briefcase;
    case "project":
      return FileText;
    case "task":
      return CheckSquare;
    case "member":
      return Users;
    default:
      return FileText;
  }
};

export default getResultIcon;
