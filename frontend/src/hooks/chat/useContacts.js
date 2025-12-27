import { useState, useEffect } from "react";
import fetchContacts from "../../utils/chat/fetchContacts";
import filterContacts from "../../utils/chat/filterContacts";
import { realtimeService } from "../../services/realtime";

export function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    fetchContacts(null, (c) => mounted && setContacts(c), setLoading);

    // Presence updates: mark contacts online/offline
    const onJoined = (member) => {
      if (!member) return;
      setContacts((prev) =>
        Array.isArray(prev)
          ? prev.map((p) =>
              String(p.id) === String(member.id) ? { ...p, online: true } : p
            )
          : prev
      );
    };

    const onLeft = (member) => {
      if (!member) return;
      setContacts((prev) =>
        Array.isArray(prev)
          ? prev.map((p) =>
              String(p.id) === String(member.id) ? { ...p, online: false } : p
            )
          : prev
      );
    };

    const unsubJoin = realtimeService.on("member_joined", onJoined);
    const unsubLeft = realtimeService.on("member_left", onLeft);

    return () => {
      mounted = false;
      try {
        unsubJoin && unsubJoin();
      } catch (e) {}
      try {
        unsubLeft && unsubLeft();
      } catch (e) {}
    };
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
