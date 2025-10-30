import * as workspaceService from "../../services/workspaceService";
import toast from "react-hot-toast";

/**
 * Handle member removal
 */
const handleRemoveMember = async (
  workspaceId,
  selectedMember,
  members,
  setMembers,
  setShowRemoveModal,
  setSelectedMember,
  setSubmitting
) => {
  setSubmitting(true);
  try {
    await workspaceService.removeMember(workspaceId, selectedMember.id);
    setMembers(members.filter((m) => m.id !== selectedMember.id));
    setShowRemoveModal(false);
    setSelectedMember(null);
    toast.success(`${selectedMember.name} removed from workspace`);
  } catch (error) {
    console.error("Error removing member:", error);
    toast.error("Failed to remove member");
  } finally {
    setSubmitting(false);
  }
};

export default handleRemoveMember;
