import { format, formatDistanceToNow } from "date-fns";
import { DATE_FORMAT, DATETIME_FORMAT } from "./constants";

// Date formatting
export const formatDate = (date, formatString = DATE_FORMAT) => {
  if (!date) return "";
  return format(new Date(date), formatString);
};

export const formatDateTime = (date) => {
  if (!date) return "";
  return format(new Date(date), DATETIME_FORMAT);
};

export const getRelativeTime = (date) => {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// String utilities
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return "";
  const names = name.split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    todo: "gray",
    in_progress: "blue",
    in_review: "yellow",
    done: "green",
    active: "green",
    on_hold: "yellow",
    completed: "blue",
    archived: "gray",
  };
  return colors[status] || "gray";
};

// Get priority color
export const getPriorityColor = (priority) => {
  const colors = {
    low: "gray",
    medium: "blue",
    high: "orange",
    urgent: "red",
  };
  return colors[priority] || "gray";
};

// Generate random color for avatars
export const generateColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];
  return colors[Math.abs(hash) % colors.length];
};

// Check if user has permission
export const hasPermission = (userRole, requiredRole) => {
  const roleHierarchy = { admin: 3, member: 2, viewer: 1 };
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
