import { useEffect } from "react";
import { fetchLogs } from "./chatApi";

export function useLoadLogs(selectedSession, setMessages, setLoading, trigger) {
  useEffect(() => {
    async function loadLogs() {
      if (!selectedSession) return;
      setLoading(true);
      try {
        const logs = await fetchLogs(selectedSession);
        setMessages(logs);
      } catch (err) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [selectedSession, setMessages, setLoading, trigger]);
}
