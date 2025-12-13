import * as workspaceService from "../../services/workspaceService";
import toast from "react-hot-toast";
import validateInvite from "./validateInvite";

/**
 * Handle member invitation
 */
const handleInviteMember = async (
  e,
  workspaceId,
  inviteData,
  members,
  setMembers,
  setShowInviteModal,
  setInviteData,
  setInviteErrors,
  setSubmitting
) => {
  if (e) e.preventDefault();

  const errors = validateInvite(inviteData, members);
  if (Object.keys(errors).length > 0) {
    setInviteErrors(errors);
    return;
  }

  setSubmitting(true);
  try {
    await workspaceService.sendWorkspaceInvite(workspaceId, inviteData);
    setShowInviteModal(false);
    setInviteData({ email: "", role: "member" });
    toast.success("Invite sent successfully");
  } catch (error) {
    console.error("Error inviting member:", error);
    toast.error("Failed to invite member");
  } finally {
    setSubmitting(false);
  }
};

export default handleInviteMember;
