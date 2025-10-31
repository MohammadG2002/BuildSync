import * as workspaceService from "../../services/workspaceService";
import toast from "react-hot-toast";

/**
 * Fetch members for a workspace
 */
const fetchMembers = async (workspaceId, setMembers, setLoading) => {
  setLoading(true);
  try {
    const data = await workspaceService.getWorkspaceMembers(workspaceId);
    console.log("Fetched members:", data);
    console.log("First member structure:", data[0]);
    setMembers(data);
  } catch (error) {
    console.error("Error fetching members:", error);
    console.error("Error details:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to load members");
    setMembers([]);
  } finally {
    setLoading(false);
  }
};

export default fetchMembers;
