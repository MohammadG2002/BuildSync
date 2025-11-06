import * as contactService from "../../services/contactService";

/**
 * Fetch global contacts (accepted + blocked by default)
 */
const fetchContacts = async (_currentWorkspace, setContacts, setLoading) => {
  setLoading(true);
  try {
    const contactsRaw = await contactService.listContacts();
    const contacts = (contactsRaw || [])
      .filter((c) => c && c.user)
      .map((c) => {
        const u = c.user;
        return {
          contactId: c.id || c._id,
          status: c.status,
          requestedBy: c.requestedBy,
          blockedBy: c.blockedBy?.id || c.blockedBy?._id || c.blockedBy || null,
          id: u.id || u._id,
          name: u.name,
          email: u.email,
          avatar: u.avatar,
          online: false,
          lastMessage: "",
          lastMessageTime: null,
          unreadCount: 0,
        };
      });
    setContacts(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    setContacts([]);
  } finally {
    setLoading(false);
  }
};

export default fetchContacts;
