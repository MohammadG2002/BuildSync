import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Filter, Check, Trash2, ArrowLeft } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import NotificationItem from "../../components/notification/NotificationItem";

const Notifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
  } = useNotifications();
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'
  const [typeFilter, setTypeFilter] = useState("all"); // 'all', 'task_assigned', 'project_updated', etc.

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    // Filter by read status
    if (filter === "unread" && notification.read) return false;
    if (filter === "read" && !notification.read) return false;

    // Filter by type
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;

    return true;
  });

  // Group notifications by date
  const groupByDate = (notifications) => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    notifications.forEach((notification) => {
      const notificationDate = new Date(notification.timestamp);
      const notificationDay = new Date(
        notificationDate.getFullYear(),
        notificationDate.getMonth(),
        notificationDate.getDate()
      );

      if (notificationDay.getTime() === today.getTime()) {
        groups.today.push(notification);
      } else if (notificationDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(notification);
      } else if (notificationDate >= weekAgo) {
        groups.thisWeek.push(notification);
      } else {
        groups.older.push(notification);
      }
    });

    return groups;
  };

  const groupedNotifications = groupByDate(filteredNotifications);

  const notificationTypes = [
    { value: "all", label: "All Types" },
    { value: "task_assigned", label: "Task Assigned" },
    { value: "project_updated", label: "Project Updates" },
    { value: "member_added", label: "New Members" },
    { value: "mention", label: "Mentions" },
    { value: "message", label: "Messages" },
    { value: "deadline", label: "Deadlines" },
  ];

  const renderNotificationGroup = (title, notifications) => {
    if (notifications.length === 0) return null;

    return (
      <div key={title} className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
          {title} ({notifications.length})
        </h3>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className="p-0 hover:shadow-md transition-shadow"
            >
              <NotificationItem
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
                onDelete={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
              />
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/app/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${
                    unreadCount > 1 ? "s" : ""
                  }`
                : "All caught up!"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="gap-2">
            <Check className="w-5 h-5" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {notifications.length}
              </p>
            </div>
            <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">Unread</p>
              <p className="text-3xl font-bold text-primary-600">
                {unreadCount}
              </p>
            </div>
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">Read</p>
              <p className="text-3xl font-bold text-green-600">
                {notifications.length - unreadCount}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {["all", "unread", "read"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-700"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            {notificationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div>
          {renderNotificationGroup("Today", groupedNotifications.today)}
          {renderNotificationGroup("Yesterday", groupedNotifications.yesterday)}
          {renderNotificationGroup("This Week", groupedNotifications.thisWeek)}
          {renderNotificationGroup("Older", groupedNotifications.older)}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {filter === "unread"
              ? "No unread notifications"
              : "No notifications found"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
            {filter === "unread"
              ? "You're all caught up! Check back later for updates."
              : "Try adjusting your filters to see more notifications."}
          </p>
        </Card>
      )}
    </div>
  );
};

export default Notifications;
