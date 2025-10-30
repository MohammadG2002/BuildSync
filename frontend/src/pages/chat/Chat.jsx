import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../hooks/useWorkspace";
import Card from "../../components/common/Card";
import {
  ContactsSidebar,
  ChatArea,
  ChatEmptyState,
  filterContacts,
} from "../../components/chatPage";
import fetchContacts from "../../utils/chat/fetchContacts";
import fetchMessages from "../../utils/chat/fetchMessages";
import scrollToBottom from "../../utils/chat/scrollToBottom";
import handleSendMessage from "../../utils/chat/handleSendMessage";
import styles from "./Chat.module.css";

const Chat = () => {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentWorkspace) {
      fetchContacts(currentWorkspace, setContacts, setLoading);
    }
  }, [currentWorkspace]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id, setMessages);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

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
              onSendMessage={() =>
                handleSendMessage(
                  message,
                  selectedContact,
                  user,
                  messages,
                  setMessages,
                  setMessage
                )
              }
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
