/**
 * Notification Handler - Handles browser notifications
 */
export class NotificationHandler {
  /**
   * Request notification permission
   */
  static async requestPermission() {
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }

  /**
   * Show browser notification
   * @param {Object} notification - Notification data
   */
  static show(notification) {
    // Request permission if needed
    if (Notification.permission === "default") {
      this.requestPermission();
    }

    // Show browser notification
    if (Notification.permission === "granted") {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: "/logo.png",
        badge: "/logo.png",
        tag: notification.id,
        requireInteraction: notification.priority === "high",
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.link) {
          window.location.href = notification.link;
        }
        browserNotification.close();
      };
    }
  }

  /**
   * Play notification sound
   */
  static playSound() {
    try {
      const audio = new Audio("/sounds/notification.mp3");
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.error("Failed to play notification sound:", error);
      });
    } catch (error) {
      console.error("Error creating audio:", error);
    }
  }
}
