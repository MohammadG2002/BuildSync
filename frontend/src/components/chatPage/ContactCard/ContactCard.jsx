import { getRelativeTime } from "../../../utils/helpers";
import UserAvatar from "../../common/UserAvatar";
import styles from "./ContactCard.module.css";

const ContactCard = ({ contact, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(contact)}
      className={`${styles.contactCard} ${
        isSelected ? styles.contactCardActive : ""
      }`}
    >
      <div className={styles.contactInfo}>
        <UserAvatar
          name={contact.name}
          avatar={contact.avatar}
          className={styles.contactAvatar}
        />
        <div className={styles.contactDetails}>
          <div className={styles.contactHeader}>
            <h4 className={styles.contactName}>{contact.name}</h4>
            {contact.lastMessageTime && (
              <span className={styles.contactTime}>
                {getRelativeTime(contact.lastMessageTime)}
              </span>
            )}
          </div>
          <p className={styles.contactLastMessage}>{contact.lastMessage}</p>
        </div>
        {contact.unreadCount > 0 && (
          <span className={styles.unreadBadge}>{contact.unreadCount}</span>
        )}
      </div>
    </button>
  );
};

export default ContactCard;
