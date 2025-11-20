import {
  Phone,
  Video,
  MoreVertical,
  Eye,
  Ban,
  CheckCheck,
  Undo2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as contactService from "../../services/contactService";
import * as chatService from "../../services/chatService";
import UserAvatar from "../common/UserAvatar";
import styles from "../../pages/chat/Chat.module.css";
import { useAuth } from "../../hooks/useAuth";

const ChatHeader = ({ selectedContact, onContactStatusChange }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const isBlocked = selectedContact?.status === "blocked";
  const isBlockedByMe =
    isBlocked &&
    (selectedContact?.blockedBy?.toString?.() || selectedContact?.blockedBy) ===
      (user?.id?.toString?.() || user?.id);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleBlock = async () => {
    try {
      await contactService.blockContact(selectedContact.id);
      toast.success("Contact blocked");
      onContactStatusChange?.("blocked", user?.id);
      setOpen(false);
    } catch (e) {
      toast.error(e?.message || "Failed to block contact");
    }
  };

  const handleUnblock = async () => {
    try {
      await contactService.unblockContact(selectedContact.id);
      toast.success("Contact unblocked");
      onContactStatusChange?.("accepted", null);
      setOpen(false);
    } catch (e) {
      toast.error(e?.message || "Failed to unblock contact");
    }
  };

  const handleMarkRead = async () => {
    try {
      await chatService.markDirectRead(selectedContact.id);
      toast.success("Marked as read");
      setOpen(false);
    } catch (e) {
      toast.error(e?.message || "Failed to mark as read");
    }
  };

  const handleViewProfile = () => {
    // No per-user profile route exists yet; navigate to Profile page for now
    navigate("/app/profile");
    setOpen(false);
  };

  return (
    <div className={styles.chatHeader}>
      <div className={styles.chatHeaderContent}>
        <div className={styles.chatHeaderLeft}>
          <UserAvatar
            name={selectedContact.name}
            avatar={selectedContact.avatar}
            className={styles.chatHeaderAvatar}
          />
          <div>
            <h3 className={styles.chatHeaderName}>{selectedContact.name}</h3>
            <p className={styles.chatHeaderStatus}>
              {selectedContact.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className={styles.menuContainer} ref={menuRef}>
          <button className={styles.iconButton}>
            <Phone className={styles.iconButtonIcon} />
          </button>
          <button className={styles.iconButton}>
            <Video className={styles.iconButtonIcon} />
          </button>
          <button
            className={styles.iconButton}
            onClick={() => setOpen((v) => !v)}
          >
            <MoreVertical className={styles.iconButtonIcon} />
          </button>
          {open && (
            <div className={styles.menuDropdown}>
              <button className={styles.menuItem} onClick={handleViewProfile}>
                <Eye className={styles.menuItemIcon} />
                <span>View profile</span>
              </button>
              <button className={styles.menuItem} onClick={handleMarkRead}>
                <CheckCheck className={styles.menuItemIcon} />
                <span>Mark as read</span>
              </button>
              <div className={styles.menuDivider} />
              {isBlocked ? (
                isBlockedByMe ? (
                  <button className={styles.menuItem} onClick={handleUnblock}>
                    <Undo2 className={styles.menuItemIcon} />
                    <span>Unblock contact</span>
                  </button>
                ) : (
                  <button className={styles.menuItem} disabled>
                    <Ban className={styles.menuItemIcon} />
                    <span>Blocked</span>
                  </button>
                )
              ) : (
                <button className={styles.menuItemDanger} onClick={handleBlock}>
                  <Ban className={styles.menuItemIcon} />
                  <span>Block contact</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
