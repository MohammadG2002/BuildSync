/**
 * Handle notification click
 */
const handleNotificationClick = (notification, markAsRead, navigate) => {
  if (!notification.read) {
    markAsRead(notification.id);
  }
  if (notification.link) {
    navigate(notification.link);
  }
};

export default handleNotificationClick;
