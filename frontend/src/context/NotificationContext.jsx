import { createContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import websocketService from "../services/websocketService";

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
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }

      // Connect to WebSocket
      const token = localStorage.getItem("token");
      if (token) {
        websocketService.connect(token);

        // Subscribe to WebSocket events
        const unsubscribeConnected = websocketService.on("connected", () => {
          console.log("WebSocket connected - real-time notifications active");
          setIsConnected(true);
        });

        const unsubscribeDisconnected = websocketService.on(
          "disconnected",
          () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
          }
        );

        const unsubscribeNotification = websocketService.on(
          "notification",
          (notification) => {
            addNotification(notification);
          }
        );

        const unsubscribeTaskUpdate = websocketService.on(
          "task_update",
          (task) => {
            addNotification({
              type: "task_update",
              title: "Task Updated",
              message: `Task "${task.title}" has been updated`,
              actionUrl: `/app/workspaces/${task.workspaceId}/projects/${task.projectId}`,
            });
          }
        );

        const unsubscribeProjectUpdate = websocketService.on(
          "project_update",
          (project) => {
            addNotification({
              type: "project_update",
              title: "Project Updated",
              message: `Project "${project.name}" has been updated`,
              actionUrl: `/app/workspaces/${project.workspaceId}`,
            });
          }
        );

        const unsubscribeMemberJoined = websocketService.on(
          "member_joined",
          (member) => {
            addNotification({
              type: "member_joined",
              title: "New Member",
              message: `${member.name} joined the workspace`,
              actionUrl: `/app/workspaces/${member.workspaceId}/members`,
            });
          }
        );

        // Store unsubscribe functions
        unsubscribeRef.current = [
          unsubscribeConnected,
          unsubscribeDisconnected,
          unsubscribeNotification,
          unsubscribeTaskUpdate,
          unsubscribeProjectUpdate,
          unsubscribeMemberJoined,
        ];
      }

      // Fetch initial notifications
      fetchNotifications();

      // Poll for notifications as fallback (every 60 seconds)
      const interval = setInterval(fetchNotifications, 60000);

      return () => {
        clearInterval(interval);
        // Unsubscribe from all events
        unsubscribeRef.current.forEach((unsubscribe) => unsubscribe());
        // Disconnect WebSocket
        websocketService.disconnect();
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      // Mock data - replace with actual API call
      const mockNotifications = [
        {
          id: "1",
          type: "task_assigned",
          title: "New task assigned",
          message: 'You have been assigned to "Update Documentation"',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          read: false,
          actionUrl: "/app/workspaces/1/projects/1",
        },
        {
          id: "2",
          type: "project_updated",
          title: "Project updated",
          message: "Website Redesign project has been updated",
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
          read: false,
          actionUrl: "/app/workspaces/1",
        },
        {
          id: "3",
          type: "member_added",
          title: "New member joined",
          message: "John Doe joined Marketing Team workspace",
          timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
          read: true,
          actionUrl: "/app/workspaces/1/members",
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // API call to mark as read
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // API call to mark all as read
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // API call to delete notification
      const notification = notifications.find((n) => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    setNotifications([newNotification, ...notifications]);
    setUnreadCount((prev) => prev + 1);

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
