import * as workspaceService from "../../services/workspaceService";
import toast from "react-hot-toast";

/**
 * Handle transfer of workspace ownership
 */
const handleTransferOwnership = async (
  workspaceId,
  member,
  refreshMembers, // callback to refetch members list
  setShowTransferModal,
  setSelectedMember,
  setSubmitting
) => {
  try {
    setSubmitting(true);
    await workspaceService.transferOwnership(workspaceId, member.id);
    toast.success(`Ownership transferred to ${member.name}`);

    // Close modal and clear selection
    setShowTransferModal(false);
    setSelectedMember(null);

    // Refresh members to reflect new roles
    if (typeof refreshMembers === "function") {
      await refreshMembers();
    }
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to transfer ownership";
    toast.error(msg);
  } finally {
    setSubmitting(false);
  }
};

export default handleTransferOwnership;
