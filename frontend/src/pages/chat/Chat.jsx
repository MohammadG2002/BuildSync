import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/common/Card";
import {
  ContactsSidebar,
  ChatArea,
  ChatEmptyState,
  filterContacts,
  mockContacts,
  mockMessages,
} from "./chatModule";
import styles from "./Chat.module.css";

const Chat = () => {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const [contacts] = useState(mockContacts);
  const [messages, setMessages] = useState(mockMessages);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedContact) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: user?.id,
      senderName: user?.name,
      content: message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const filteredContacts = filterContacts(contacts, searchQuery);

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.chatLayout}>
          <ContactsSidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            contacts={filteredContacts}
            selectedContact={selectedContact}
            onSelectContact={setSelectedContact}
          />

          {selectedContact ? (
            <ChatArea
              selectedContact={selectedContact}
              messages={messages}
              currentUserId={user?.id}
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
              messagesEndRef={messagesEndRef}
            />
          ) : (
            <ChatEmptyState />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Chat;
