import { useState, useEffect } from "react";
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
import { useWorkspace } from "../../hooks/useWorkspace";

const ActivityFeed = ({
  workspaceId = null,
  projectId = null,
  limit = 20,
  showFilters = true,
}) => {
  const { currentWorkspace } = useWorkspace();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Activity type configurations
  const activityConfig = {
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

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await activityService.getActivities({ workspaceId, projectId, limit });

        // Mock data for demonstration
        const mockActivities = generateMockActivities();

        setTimeout(() => {
          setActivities(mockActivities);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, [workspaceId, projectId, limit]);

  // Generate mock activities
  const generateMockActivities = () => {
    const types = Object.keys(activityConfig);
    const users = [
      "John Doe",
      "Jane Smith",
      "Mike Johnson",
      "Sarah Williams",
      "Tom Brown",
    ];
    const projects = [
      "Website Redesign",
      "Mobile App",
      "API Development",
      "Marketing Campaign",
    ];
    const tasks = [
      "Update homepage",
      "Fix navigation bug",
      "Add dark mode",
      "Create user guide",
    ];

    return Array.from({ length: 20 }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const project = projects[Math.floor(Math.random() * projects.length)];
      const task = tasks[Math.floor(Math.random() * tasks.length)];

      return {
        id: i + 1,
        type,
        user: {
          name: user,
          avatar: `https://ui-avatars.com/api/?name=${user.replace(
            " ",
            "+"
          )}&background=random`,
        },
        description: getActivityDescription(type, user, project, task),
        timestamp: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        metadata: {
          project,
          task,
        },
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Generate activity description
  const getActivityDescription = (type, user, project, task) => {
    switch (type) {
      case "task_created":
        return `created task "${task}" in ${project}`;
      case "task_completed":
        return `completed task "${task}"`;
      case "task_updated":
        return `updated task "${task}"`;
      case "task_deleted":
        return `deleted task "${task}"`;
      case "comment_added":
        return `commented on "${task}"`;
      case "member_added":
        return `added a new member to ${project}`;
      case "member_removed":
        return `removed a member from ${project}`;
      case "file_uploaded":
        return `uploaded a file to "${task}"`;
      case "file_downloaded":
        return `downloaded a file from "${task}"`;
      case "project_created":
        return `created project "${project}"`;
      case "project_archived":
        return `archived project "${project}"`;
      case "settings_changed":
        return `updated ${project} settings`;
      case "status_changed":
        return `changed status of "${task}"`;
      default:
        return `performed an action`;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true;
    if (filter === "tasks") return activity.type.startsWith("task_");
    if (filter === "projects") return activity.type.startsWith("project_");
    if (filter === "members") return activity.type.includes("member_");
    if (filter === "files") return activity.type.includes("file_");
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { value: "all", label: "All Activity" },
            { value: "tasks", label: "Tasks" },
            { value: "projects", label: "Projects" },
            { value: "members", label: "Members" },
            { value: "files", label: "Files" },
          ].map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === filterOption.value
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      )}

      {/* Activity List */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              No activities yet
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const config =
              activityConfig[activity.type] || activityConfig.status_changed;
            const Icon = config.icon;

            return (
              <div
                key={activity.id}
                className="flex gap-4 group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 -mx-3 rounded-lg transition-colors"
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        <span className="font-medium">
                          {activity.user.name}
                        </span>{" "}
                        <span className="text-gray-600 dark:text-gray-400">
                          {activity.description}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <time className="text-xs text-gray-500 dark:text-gray-500">
                          {formatTimestamp(activity.timestamp)}
                        </time>
                        <span className="text-xs text-gray-400 dark:text-gray-600">
                          •
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {config.label}
                        </span>
                      </div>
                    </div>
                    {/* User Avatar */}
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length >= limit && (
        <button
          onClick={() => {
            /* TODO: Load more activities */
          }}
          className="w-full py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          Load More Activities
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;
