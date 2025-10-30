import * as workspaceService from "../../services/workspaceService";
import toast from "react-hot-toast";

/**
 * Handle member role change
 */
const handleChangeRole = async (
  member,
  newRole,
  workspaceId,
  members,
  setMembers
) => {
  try {
    await workspaceService.updateMemberRole(workspaceId, member.id, newRole);
    setMembers(
      members.map((m) => (m.id === member.id ? { ...m, role: newRole } : m))
    );
    toast.success(`${member.name}'s role updated to ${newRole}`);
  } catch (error) {
    console.error("Error updating role:", error);
    toast.error("Failed to update role");
  }
};

export default handleChangeRole;
