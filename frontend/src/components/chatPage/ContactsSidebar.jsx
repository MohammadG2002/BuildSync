import { Search } from "lucide-react";
import Input from "../common/Input";
import ContactCard from "./ContactCard";
import styles from "../../pages/chat/Chat.module.css";

const ContactsSidebar = ({
  searchQuery,
  onSearchChange,
  contacts,
  selectedContact,
  onSelectContact,
}) => {
  return (
    <div className={styles.contactsSidebar}>
      {/* Search */}
      <div className={styles.searchContainer}>
        <Input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
        />
      </div>

      {/* Contacts List */}
      <div className={styles.contactsList}>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isSelected={selectedContact?.id === contact.id}
              onSelect={onSelectContact}
            />
          ))
        ) : (
          <div className={styles.noContacts}>
            <p>No contacts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsSidebar;
