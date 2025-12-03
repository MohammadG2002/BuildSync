import { Search, UserPlus } from "lucide-react";
import Input from "../../common/input/Input";
import ContactCard from "../ContactCard/ContactCard";
import styles from "./ContactsSidebar.module.css";

const ContactsSidebar = ({
  searchQuery,
  onSearchChange,
  contacts,
  selectedContact,
  onSelectContact,
  onAddContact,
}) => {
  return (
    <div className={styles.contactsSidebar}>
      {/* Add Contact */}
      <div className={styles.addContactRow}>
        <button className={styles.addContactButton} onClick={onAddContact}>
          <UserPlus className={styles.addContactIcon} />
          Add Contact
        </button>
      </div>
      {/* Search */}
      <div className={styles.searchWrapper}>
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
