import { createContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import {
  mockNotifications,
  WebSocketManager,
  NotificationTransformer,
  NotificationOperations,
} from "./notificationContextModule";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const unsubscribeRef = useRef([]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (user) {
      // Request notification permission
      WebSocketManager.requestPermission();

      // Connect to WebSocket
      const token = localStorage.getItem("token");
      if (token) {
        const unsubscribers = WebSocketManager.connect(token, {
          onConnected: () => setIsConnected(true),
          onDisconnected: () => setIsConnected(false),
          onNotification: (notification) => addNotification(notification),
          onTaskUpdate: (task) =>
            addNotification(NotificationTransformer.fromTaskUpdate(task)),
          onProjectUpdate: (project) =>
            addNotification(NotificationTransformer.fromProjectUpdate(project)),
          onMemberJoined: (member) =>
            addNotification(NotificationTransformer.fromMemberJoined(member)),
        });

        unsubscribeRef.current = unsubscribers;
      }

      // Fetch initial notifications
      fetchNotifications();

      // Poll for notifications as fallback (every 60 seconds)
      const interval = setInterval(fetchNotifications, 60000);

      return () => {
        clearInterval(interval);
        // Unsubscribe from all events and disconnect
        WebSocketManager.disconnect(unsubscribeRef.current);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      // Mock data - replace with actual API call
      setNotifications(mockNotifications);
      setUnreadCount(
        NotificationOperations.calculateUnreadCount(mockNotifications)
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // API call to mark as read
      const result = NotificationOperations.markAsRead(
        notifications,
        notificationId
      );
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // API call to mark all as read
      const result = NotificationOperations.markAllAsRead(notifications);
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // API call to delete notification
      const result = NotificationOperations.deleteNotification(
        notifications,
        notificationId
      );
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const addNotification = (notification) => {
    const enriched = NotificationTransformer.enrichNotification(notification);
    const result = NotificationOperations.addNotification(
      notifications,
      enriched
    );
    setNotifications(result.notifications);
    setUnreadCount(result.unreadCount);

    // Show toast
    toast(notification.message, {
      icon: "🔔",
      duration: 4000,
    });
  };

  const value = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
