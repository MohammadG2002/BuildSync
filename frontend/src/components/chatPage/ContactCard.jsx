import {
  getInitials,
  generateColor,
  getRelativeTime,
} from "../../utils/helpers";
import styles from "../../pages/chat/Chat.module.css";

const ContactCard = ({ contact, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(contact)}
      className={`${styles.contactCard} ${
        isSelected ? styles.contactCardActive : ""
      }`}
    >
      {/* Avatar */}
      <div className={styles.contactAvatarContainer}>
        <div
          className={styles.contactAvatar}
          style={{ backgroundColor: generateColor(contact.name) }}
        >
          {getInitials(contact.name)}
        </div>
        {contact.online && <div className={styles.onlineIndicator}></div>}
      </div>

      {/* Info */}
      <div className={styles.contactInfo}>
        <div className={styles.contactHeader}>
          <h4 className={styles.contactName}>{contact.name}</h4>
          <span className={styles.contactTime}>
            {getRelativeTime(contact.lastMessageTime)}
          </span>
        </div>
        <div className={styles.contactMessage}>
          <p className={styles.contactLastMessage}>{contact.lastMessage}</p>
          {contact.unreadCount > 0 && (
            <span className={styles.unreadBadge}>{contact.unreadCount}</span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ContactCard;
