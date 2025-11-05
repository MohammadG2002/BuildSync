import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../hooks/useWorkspace";
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
import * as workspaceService from "../../services/workspaceService";
import realtimeService from "../../services/realtime";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      fetchContacts(currentWorkspace, setContacts, setLoading);
    }
  }, [currentWorkspace]);

  useEffect(() => {
    if (currentWorkspace) {
      fetchMessages(
        currentWorkspace.id,
        setMessages,
        selectedContact ? selectedContact.id : undefined
      );
    }
  }, [currentWorkspace, selectedContact]);

  // Join realtime channels and subscribe to DM events
  useEffect(() => {
    if (!currentWorkspace) return;

    const join = () => {
      // For WS provider, explicitly join; for Pusher, subscriptions are handled on connect
      realtimeService.send("join_workspace", {
        workspaceId: currentWorkspace.id,
      });
    };

    // Join immediately if connected; also join on future reconnects
    if (realtimeService.isConnected()) join();
    const unsubConnected = realtimeService.on("connected", join);

    // DM live updates
    const unsubDM = realtimeService.on("dm_message", (msg) => {
      // Normalize payload shape to UI message
      const normalized = {
        id: msg._id || msg.id,
        senderId: msg.sender?._id || msg.senderId,
        senderName: msg.sender?.name || msg.senderName,
        content: msg.content,
        timestamp: msg.createdAt || msg.timestamp,
      };
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

    return () => {
      unsubConnected?.();
      unsubDM?.();
      realtimeService.send("leave_workspace", {
        workspaceId: currentWorkspace.id,
      });
    };
  }, [currentWorkspace, selectedContact]);

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
            onAddContact={() => setShowAddModal(true)}
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
                  currentWorkspace?.id,
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
              disabled={!inviteEmail.trim() || !currentWorkspace}
              onClick={async () => {
                try {
                  setSubmitting(true);
                  await workspaceService.sendWorkspaceInvite(
                    currentWorkspace.id,
                    { email: inviteEmail, role: "member" }
                  );
                  setShowAddModal(false);
                  setInviteEmail("");
                  // Refresh contacts from members
                  fetchContacts(currentWorkspace, setContacts, setLoading);
                } catch (e) {
                  console.error("Invite failed", e);
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
