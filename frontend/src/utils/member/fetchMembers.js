import * as workspaceService from "../../../services/workspaceService";
import toast from "react-hot-toast";

/**
 * Fetch members for a workspace
 */
const fetchMembers = async (workspaceId, setMembers, setLoading) => {
  setLoading(true);
  try {
    const data = await workspaceService.getWorkspaceMembers(workspaceId);
    setMembers(data);
  } catch (error) {
    console.error("Error fetching members:", error);
    toast.error("Failed to load members");
    setMembers([]);
  } finally {
    setLoading(false);
  }
};

export default fetchMembers;
