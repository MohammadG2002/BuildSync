import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  MessageSquare,
  Archive,
} from "lucide-react";

const getMenuItems = (currentWorkspace) => [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/app/dashboard",
    global: true,
  },
  {
    name: "Workspaces",
    icon: Briefcase,
    path: "/app/workspaces",
    global: true,
  },
  {
    name: "Members",
    icon: Users,
    path: currentWorkspace
      ? `/app/workspaces/${currentWorkspace.id}/members`
      : "#",
    requiresWorkspace: true,
  },
  {
    name: "Settings",
    icon: Settings,
    path: currentWorkspace
      ? `/app/workspaces/${currentWorkspace.id}/settings`
      : "#",
    requiresWorkspace: true,
  },
  {
    name: "Chat",
    icon: MessageSquare,
    path: "/app/chat",
    global: true,
  },
  {
    name: "Archived",
    icon: Archive,
    path: "/app/archived",
    global: true,
  },
];

export default getMenuItems;
