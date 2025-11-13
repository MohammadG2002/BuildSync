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
        const restored = window.sessionStorage.getItem("aiSessionId");
        if (restored) {
          setSelectedSession(restored);
        }
      } catch (err) {
        setSessions([]);
      } finally {
        setLoadingSessions(false);
      }
    }
    loadSessions();
  }, [setSessions, setSelectedSession, setLoadingSessions]);
}
