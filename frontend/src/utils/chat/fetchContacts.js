import * as contactService from "../../services/contactService";

/**
 * Fetch global contacts (accepted status)
 */
const fetchContacts = async (_currentWorkspace, setContacts, setLoading) => {
  setLoading(true);
  try {
    const contactsRaw = await contactService.listContacts("accepted");
    const contacts = (contactsRaw || [])
      .map((c) => c.user)
      .filter(Boolean)
      .map((u) => ({
        id: u.id || u._id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        online: false,
        lastMessage: "",
        lastMessageTime: null,
        unreadCount: 0,
      }));
    setContacts(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    setContacts([]);
  } finally {
    setLoading(false);
  }
};

export default fetchContacts;
