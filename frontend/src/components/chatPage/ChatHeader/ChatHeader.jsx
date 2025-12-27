import { MoreVertical, Eye, Ban, CheckCheck, Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as contactService from "../../../services/contactService";
import * as chatService from "../../../services/chatService";
import UserAvatar from "../../common/UserAvatar/UserAvatar/UserAvatar";
import styles from "./ChatHeader.module.css";
import { useAuth } from "../../../hooks/useAuth";

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

  const resolveId = (val) => {
    if (!val) return null;
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (val._id) return String(val._id);
    if (val.id) return String(val.id);
    try {
      const s = val.toString();
      if (s && s !== "[object Object]") return s;
    } catch (e) {
      // ignore
    }
    return null;
  };

  const handleViewProfile = (contactOrId) => {
    // Accept either an id or a contact object and navigate to the proper profile route
    const id =
      resolveId(contactOrId) ||
      resolveId(contactOrId?.id) ||
      resolveId(contactOrId?._id);
    if (id) {
      navigate(`/app/profile/${id}`);
    } else {
      navigate("/app/profile");
    }
    setOpen(false);
  };

  return (
    <div className={styles.chatHeader}>
      <div className={styles.chatHeaderContent}>
        <div
          className={styles.chatHeaderLeft}
          // clicking the avatar or name opens the user's profile
          onClick={() => handleViewProfile(selectedContact)}
          style={{ cursor: "pointer" }}
        >
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
          {/* Removed phone/video placeholders */}
          <button
            className={styles.iconButton}
            onClick={() => setOpen((v) => !v)}
          >
            <MoreVertical className={styles.iconButtonIcon} />
          </button>
          {open && (
            <div className={styles.menuDropdown}>
              <button
                className={styles.menuItem}
                onClick={() => handleViewProfile(selectedContact)}
              >
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
