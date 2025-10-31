import {
  Clock,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  FileText,
  MessageSquare,
  Trash2,
  Edit,
  GitBranch,
  Upload,
  Download,
  Settings,
  Archive,
  User,
} from "lucide-react";

export const activityConfig = {
  task_created: {
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    label: "Task Created",
  },
  task_completed: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    label: "Task Completed",
  },
  task_updated: {
    icon: Edit,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    label: "Task Updated",
  },
  task_deleted: {
    icon: Trash2,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    label: "Task Deleted",
  },
  comment_added: {
    icon: MessageSquare,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    label: "Comment Added",
  },
  member_added: {
    icon: UserPlus,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    label: "Member Added",
  },
  member_removed: {
    icon: User,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-900/30",
    label: "Member Removed",
  },
  file_uploaded: {
    icon: Upload,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    label: "File Uploaded",
  },
  file_downloaded: {
    icon: Download,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    label: "File Downloaded",
  },
  project_created: {
    icon: GitBranch,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    label: "Project Created",
  },
  project_archived: {
    icon: Archive,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    label: "Project Archived",
  },
  settings_changed: {
    icon: Settings,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-900/30",
    label: "Settings Changed",
  },
  status_changed: {
    icon: AlertCircle,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    label: "Status Changed",
  },
};

export const filterOptions = [
  { value: "all", label: "All Activity" },
  { value: "tasks", label: "Tasks" },
  { value: "projects", label: "Projects" },
  { value: "members", label: "Members" },
  { value: "files", label: "Files" },
];
