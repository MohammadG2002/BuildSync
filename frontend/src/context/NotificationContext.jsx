import { createContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import {
  WebSocketManager,
  NotificationTransformer,
  NotificationOperations,
} from "./notificationContextModule";
import {
  getNotifications,
  markAsRead as apiMarkAsRead,
  markAllAsRead as apiMarkAllAsRead,
  deleteNotification as apiDeleteNotification,
} from "../services/notificationService";

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
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(NotificationOperations.calculateUnreadCount(data));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Backend call (optimistic update pattern)
      const optimistic = NotificationOperations.markAsRead(
        notifications,
        notificationId
      );
      setNotifications(optimistic.notifications);
      setUnreadCount(optimistic.unreadCount);
      await apiMarkAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Refetch to sync with server if failure
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      const optimistic = NotificationOperations.markAllAsRead(notifications);
      setNotifications(optimistic.notifications);
      setUnreadCount(optimistic.unreadCount);
      await apiMarkAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      fetchNotifications();
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const optimistic = NotificationOperations.deleteNotification(
        notifications,
        notificationId
      );
      setNotifications(optimistic.notifications);
      setUnreadCount(optimistic.unreadCount);
      await apiDeleteNotification(notificationId);
    } catch (error) {
      console.error("Error deleting notification:", error);
      fetchNotifications();
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
