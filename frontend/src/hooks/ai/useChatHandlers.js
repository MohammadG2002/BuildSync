import { useCallback } from "react";

export function useChatHandlers({
  setSessions,
  setSelectedSession,
  setMessages,
  setReloadLogs,
}) {
  const startNewSession = useCallback(() => {
    // Generate persistent session id only if none exists yet.
    const existing = window.localStorage.getItem("aiSessionId");
    const newSessionId = existing || `session-${Date.now()}`;
    if (!existing) {
      window.localStorage.setItem("aiSessionId", newSessionId);
    }
    setSessions((prev) => {
      // Avoid duplicating the session if it already exists in list.
      const already = (prev || []).some((s) => (s._id || s) === newSessionId);
      return already
        ? prev
        : [{ _id: newSessionId, local: true }, ...(prev || [])];
    });
    setSelectedSession(newSessionId);
    setMessages([]);
    setReloadLogs((c) => c + 1);
  }, [setSessions, setSelectedSession, setMessages, setReloadLogs]);

  const endSession = useCallback(() => {
    window.localStorage.removeItem("aiSessionId");
    setSelectedSession(null);
  }, [setSelectedSession]);

  return { startNewSession, endSession };
}
