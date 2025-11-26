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

      // Add optimistic user message with "sending" status
      const userMessageId = Date.now();
      const userMessage = {
        id: userMessageId,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
        status: "sending",
      };
      setMessages((m) => [...m, userMessage]);

      setLoading(true);
      try {
        const { ok, data } = await sendMessage(trimmed, selectedSession);

        // Update user message status to "sent"
        setMessages((m) =>
          m.map((msg) =>
            msg.id === userMessageId ? { ...msg, status: "sent" } : msg
          )
        );

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
        // Update user message status to "failed"
        setMessages((m) =>
          m.map((msg) =>
            msg.id === userMessageId ? { ...msg, status: "failed" } : msg
          )
        );
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
