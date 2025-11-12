import { useState, useEffect } from "react";
import fetchContacts from "../../utils/chat/fetchContacts";
import filterContacts from "../../utils/chat/filterContacts";

export function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchContacts(null, setContacts, setLoading);
  }, []);

  const filteredContacts = filterContacts(contacts, searchQuery);

  return {
    contacts,
    setContacts,
    loading,
    searchQuery,
    setSearchQuery,
    filteredContacts,
  };
}
