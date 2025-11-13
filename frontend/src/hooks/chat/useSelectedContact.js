import { useEffect } from "react";

export function useSelectedContact(
  chatId,
  contacts,
  selectedContact,
  setSelectedContact
) {
  useEffect(() => {
    if (!chatId) return;
    if (!contacts || contacts.length === 0) return;
    const match = contacts.find((c) => String(c.id) === String(chatId));
    if (match && (!selectedContact || selectedContact.id !== match.id)) {
      setSelectedContact(match);
    }
  }, [chatId, contacts, selectedContact, setSelectedContact]);
}
