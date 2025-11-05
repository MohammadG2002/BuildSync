import * as workspaceService from "../../services/workspaceService";
import { ResponseNormalizer } from "../../services/shared";

/**
 * Fetch contacts for current workspace
 */
const fetchContacts = async (currentWorkspace, setContacts, setLoading) => {
  setLoading(true);
  try {
    if (currentWorkspace) {
      // Load workspace members and map to contact shape
      const members = await workspaceService.getWorkspaceMembers(
        currentWorkspace.id
      );
      const contacts = (members || []).map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        avatar: m.avatar,
        online: false,
        lastMessage: "",
        lastMessageTime: null,
        unreadCount: 0,
      }));
      setContacts(contacts);
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
    setContacts([]);
  } finally {
    setLoading(false);
  }
};

export default fetchContacts;
