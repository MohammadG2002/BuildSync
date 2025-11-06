import { useState, useEffect, useRef } from "react";
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
import filterContacts from "../../utils/chat/filterContacts";
import fetchContacts from "../../utils/chat/fetchContacts";
import fetchMessages from "../../utils/chat/fetchMessages";
import scrollToBottom from "../../utils/chat/scrollToBottom";
import handleSendMessage from "../../utils/chat/handleSendMessage";
import * as contactService from "../../services/contactService";
import realtimeService from "../../services/realtime";
import toast from "react-hot-toast";
import styles from "./Chat.module.css";

const Chat = () => {
  const { user } = useAuth();
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Global contacts: aggregate across all workspaces
  useEffect(() => {
    fetchContacts(null, setContacts, setLoading);
  }, []);

  useEffect(() => {
    fetchMessages(
      setMessages,
      selectedContact ? selectedContact.id : undefined
    );
  }, [selectedContact]);

  // When contacts load or chatId changes, preselect the contact from URL
  useEffect(() => {
    if (!chatId) return;
    if (!contacts || contacts.length === 0) return;
    const match = contacts.find((c) => String(c.id) === String(chatId));
    if (match && (!selectedContact || selectedContact.id !== match.id)) {
      setSelectedContact(match);
    }
  }, [chatId, contacts]);

  // Subscribe to DM events (no workspace join needed)
  useEffect(() => {
    const unsubDM = realtimeService.on("dm_message", (msg) => {
      // Normalize payload shape to UI message
      const normalized = {
        id: msg._id || msg.id,
        senderId: msg.sender?._id || msg.senderId,
        senderName: msg.sender?.name || msg.senderName,
        content: msg.content,
        timestamp: msg.createdAt || msg.timestamp,
        attachments: msg.attachments || [],
      };
      // Ignore echo of messages we just sent locally to avoid duplicates
      if (normalized.senderId === user?.id) {
        return;
      }
      // If selectedContact is the other participant, append
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
            onSelectContact={(c) => {
              setSelectedContact(c);
              // Push route for deep-linking and reloads
              navigate(`/app/chat/${c.id}`);
            }}
            onAddContact={() => setShowAddModal(true)}
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
        onClose={() => {
          setShowAddModal(false);
          setInviteEmail("");
        }}
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
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setInviteEmail("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              loading={submitting}
              disabled={!inviteEmail.trim()}
              onClick={async () => {
                try {
                  setSubmitting(true);
                  const contact = await contactService.requestContactByEmail(
                    inviteEmail.trim()
                  );
                  toast.success(
                    contact ? "Contact request sent" : "Invite processed"
                  );
                  setShowAddModal(false);
                  setInviteEmail("");
                  // Refresh accepted contacts; note a new request is pending until accepted
                  fetchContacts(null, setContacts, setLoading);
                } catch (e) {
                  console.error("Invite failed", e);
                  toast.error("Failed to send contact invite");
                } finally {
                  setSubmitting(false);
                }
              }}
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
