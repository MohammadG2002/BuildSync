import { useEffect } from "react";
import realtimeService from "../services/realtime";
import { useAuth } from "../hooks/useAuth";
import { useWorkspace } from "../hooks/useWorkspace";

export default function RealtimeProvider({ children }) {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    // Reconnect when workspace changes (to switch presence channel in pusher)
    realtimeService.disconnect();
    realtimeService.connect(token, {
      userId: user.id,
      workspaceId: currentWorkspace?.id,
    });

    return () => {
      realtimeService.disconnect();
    };
  }, [user?.id, currentWorkspace?.id]);

  return children;
}
