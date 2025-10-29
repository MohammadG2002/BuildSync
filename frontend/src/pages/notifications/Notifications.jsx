import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Filter, Check, Trash2, ArrowLeft } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import NotificationItem from "../../components/notification/NotificationItem";
import styles from "./Notifications.module.css";

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
      <div key={title} className={styles.notificationGroup}>
        <h3 className={styles.groupTitle}>
          {title} ({notifications.length})
        </h3>
        <div className={styles.notificationList}>
          {notifications.map((notification) => (
            <Card key={notification.id} className={styles.notificationCard}>
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
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            variant="ghost"
            onClick={() => navigate("/app/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className={styles.title}>Notifications</h1>
            <p className={styles.subtitle}>
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
      <div className={styles.statsGrid}>
        <Card>
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>Total</p>
              <p className={styles.statValue}>{notifications.length}</p>
            </div>
            <Bell className={styles.statIcon} />
          </div>
        </Card>
        <Card>
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>Unread</p>
              <p className={`${styles.statValue} ${styles.statValueBlue}`}>
                {unreadCount}
              </p>
            </div>
            <div
              className={`${styles.statIconWrapper} ${styles.statIconWrapperBlue}`}
            >
              <Bell className={styles.statIconInner} />
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>Read</p>
              <p className={`${styles.statValue} ${styles.statValueGreen}`}>
                {notifications.length - unreadCount}
              </p>
            </div>
            <div
              className={`${styles.statIconWrapper} ${styles.statIconWrapperGreen}`}
            >
              <Check className={styles.statIconInner} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Filter className="w-5 h-5" />
            <span className={styles.filterLabel}>Filter:</span>
          </div>

          {/* Status Filter */}
          <div className={styles.filterGroup}>
            {["all", "unread", "read"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`${styles.filterButton} ${
                  filter === status
                    ? styles.filterButtonActive
                    : styles.filterButtonInactive
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className={styles.selectWrapper}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={styles.select}
            >
              {notificationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className={styles.notificationGroups}>
          {renderNotificationGroup("Today", groupedNotifications.today)}
          {renderNotificationGroup("Yesterday", groupedNotifications.yesterday)}
          {renderNotificationGroup("This Week", groupedNotifications.thisWeek)}
          {renderNotificationGroup("Older", groupedNotifications.older)}
        </div>
      ) : (
        <Card className={styles.emptyState}>
          <Bell className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>
            {filter === "unread"
              ? "No unread notifications"
              : "No notifications found"}
          </h3>
          <p className={styles.emptyDescription}>
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
