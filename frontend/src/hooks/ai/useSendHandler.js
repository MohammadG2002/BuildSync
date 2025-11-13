import { useCallback } from "react";
import { sendMessage } from "../../services/aiChatService";

export function useSendHandler({
  selectedSession,
  setInput,
  setLoading,
  setMessages,
  setReloadLogs,
}) {
  const send = useCallback(
    async (input) => {
      const trimmed = input.trim();
      if (!trimmed || !selectedSession) return;
      setInput("");
      setLoading(true);
      try {
        const { ok, data } = await sendMessage(trimmed, selectedSession);
        if (!ok) {
          const errMsg = data?.error || `HTTP ${data?.status}`;
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              content: `(Error: ${errMsg})`,
              timestamp: new Date(),
            },
          ]);
        }
        setReloadLogs((c) => c + 1);
      } catch (e) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `(Error: ${e.message || "failed to get reply"})`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [selectedSession, setInput, setLoading, setMessages, setReloadLogs]
  );

  return { send };
}
