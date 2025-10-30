import * as chatService from "../../services/chatService";

/**
 * Fetch contacts for current workspace
 */
const fetchContacts = async (currentWorkspace, setContacts, setLoading) => {
  setLoading(true);
  try {
    if (currentWorkspace) {
      const data = await chatService.getContacts(currentWorkspace.id);
      setContacts(data);
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
    setContacts([]);
  } finally {
    setLoading(false);
  }
};

export default fetchContacts;
