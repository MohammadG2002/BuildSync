import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import {
  ContactsSidebar,
  ChatArea,
  ChatEmptyState,
} from "../../components/chatPage";
import handleSendMessage from "../../utils/chat/handleSendMessage";
import styles from "./Chat.module.css";
import { useContacts } from "./useContacts";
import { useMessages } from "./useMessages";
import { useSelectedContact } from "./useSelectedContact";
import { useInviteModal } from "./useInviteModal";

const Chat = () => {
  const { user } = useAuth();
  const { chatId } = useParams();
  const navigate = useNavigate();

  // Contacts hook
  const {
    contacts,
    setContacts,
    loading,
    searchQuery,
    setSearchQuery,
    filteredContacts,
  } = useContacts();

  // Selected contact state
  const [selectedContact, setSelectedContact] = useState(null);
  useSelectedContact(chatId, contacts, selectedContact, setSelectedContact);

  // Messages hook
  const { messages, setMessages, messagesEndRef } = useMessages(
    selectedContact,
    user
  );

  // Message input
  const [message, setMessage] = useState("");

  // Invite modal hook
  const {
    showAddModal,
    setShowAddModal,
    inviteEmail,
    setInviteEmail,
    submitting,
    openModal,
    closeModal,
    sendInvite,
  } = useInviteModal(setContacts, loading);

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.chatLayout}>
          <ContactsSidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            contacts={filteredContacts}
            selectedContact={selectedContact}
            onSelectContact={(c) => {
              setSelectedContact(c);
              navigate(`/app/chat/${c.id}`);
            }}
            onAddContact={openModal}
          />

          {selectedContact ? (
            <ChatArea
              selectedContact={selectedContact}
              messages={messages}
              currentUserId={user?.id}
              message={message}
              onMessageChange={setMessage}
              onSendMessage={({ attachments } = {}) =>
                handleSendMessage(
                  message,
                  selectedContact,
                  user,
                  messages,
                  setMessages,
                  setMessage,
                  attachments || []
                )
              }
              messagesEndRef={messagesEndRef}
              onContactStatusChange={(status, blockedBy) => {
                setSelectedContact((prev) =>
                  prev && prev.id === selectedContact.id
                    ? { ...prev, status, blockedBy }
                    : prev
                );
                setContacts((prev) =>
                  Array.isArray(prev)
                    ? prev.map((c) =>
                        c.id === selectedContact.id
                          ? { ...c, status, blockedBy }
                          : c
                      )
                    : prev
                );
              }}
            />
          ) : (
            <ChatEmptyState />
          )}
        </div>
      </Card>

      {/* Add Contact / Invite Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={closeModal}
        title="Add Contact"
        size="sm"
      >
        <div className={styles.inviteForm}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="user@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            autoFocus
          />
          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              loading={submitting}
              disabled={!inviteEmail.trim()}
              onClick={sendInvite}
            >
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Chat;
