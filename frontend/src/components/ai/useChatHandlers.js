import { useCallback } from "react";

export function useChatHandlers({
  setSessions,
  setSelectedSession,
  setMessages,
  setReloadLogs,
}) {
  const startNewSession = useCallback(() => {
    const newSessionId = `session-${Date.now()}`;
    window.sessionStorage.setItem("aiSessionId", newSessionId);
    setSessions((prev) => [
      { _id: newSessionId, local: true },
      ...(prev || []),
    ]);
    setSelectedSession(newSessionId);
    setMessages([]);
    setReloadLogs((c) => c + 1);
  }, [setSessions, setSelectedSession, setMessages, setReloadLogs]);

  return { startNewSession };
}
