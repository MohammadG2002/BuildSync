import { useState, useEffect, useRef } from "react";
import fetchMessages from "../../utils/chat/fetchMessages";
import scrollToBottom from "../../utils/chat/scrollToBottom";
import realtimeService from "../../services/realtime";

export function useMessages(selectedContact, user) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages(
      setMessages,
      selectedContact ? selectedContact.id : undefined
    );
  }, [selectedContact]);

  useEffect(() => {
    const unsubDM = realtimeService.on("dm_message", (msg) => {
      const normalized = {
        id: msg._id || msg.id,
        senderId: msg.sender?._id || msg.senderId,
        senderName: msg.sender?.name || msg.senderName,
        content: msg.content,
        timestamp: msg.createdAt || msg.timestamp,
        attachments: msg.attachments || [],
      };
      if (normalized.senderId === user?.id) {
        return;
      }
      const recipientId =
        typeof msg.recipient === "object" ? msg.recipient?._id : msg.recipient;
      if (
        selectedContact &&
        (normalized.senderId === selectedContact.id ||
          recipientId === selectedContact.id)
      ) {
        setMessages((prev) => [...prev, normalized]);
        scrollToBottom(messagesEndRef);
      }
    });
    return () => unsubDM?.();
  }, [selectedContact, user]);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

  return {
    messages,
    setMessages,
    messagesEndRef,
  };
}
