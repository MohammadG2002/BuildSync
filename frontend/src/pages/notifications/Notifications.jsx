import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Filter, Check, Trash2, ArrowLeft } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import NotificationItem from "../../components/notification/NotificationItem";
import { groupByDate, notificationTypes } from "../../components/notifications";
import handleNotificationClick from "../../utils/notification/handleNotificationClick";
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

  const filteredNotifications = notifications.filter((notification) => {
    // Filter by read status
    if (filter === "unread" && notification.read) return false;
    if (filter === "read" && !notification.read) return false;

    // Filter by type
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;

    return true;
  });

  const groupedNotifications = groupByDate(filteredNotifications);

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
                onClick={() =>
                  handleNotificationClick(notification, markAsRead, navigate)
                }
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
            className={styles.headerBackButton}
          >
            <ArrowLeft className={styles.headerBackIcon} />
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
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className={styles.headerMarkButton}
          >
            <Check className={styles.headerMarkIcon} />
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
            <Filter className={styles.filterIcon} />
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
