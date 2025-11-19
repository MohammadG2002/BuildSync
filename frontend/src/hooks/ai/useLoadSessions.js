import { useEffect } from "react";
import { fetchSessions } from "../../services/aiChatService";

export function useLoadSessions(
  setSessions,
  setSelectedSession,
  setLoadingSessions
) {
  useEffect(() => {
    async function loadSessions() {
      setLoadingSessions(true);
      try {
        const sessionsData = await fetchSessions();
        setSessions(sessionsData);

        // Prefer persistent localStorage session id.
        let restored = window.localStorage.getItem("aiSessionId");
        // Migration: fall back to any legacy sessionStorage value once.
        if (!restored) {
          const legacy = window.sessionStorage.getItem("aiSessionId");
          if (legacy) {
            restored = legacy;
            window.localStorage.setItem("aiSessionId", legacy);
            window.sessionStorage.removeItem("aiSessionId");
          }
        }
        if (restored) setSelectedSession(restored);
      } catch (err) {
        setSessions([]);
      } finally {
        setLoadingSessions(false);
      }
    }
    loadSessions();
  }, [setSessions, setSelectedSession, setLoadingSessions]);
}
