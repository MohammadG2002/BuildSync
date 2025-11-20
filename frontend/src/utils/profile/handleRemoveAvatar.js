import toast from "react-hot-toast";
import apiClient from "../../services/apiClient";
import * as authService from "../../services/authService";

/**
 * Remove the current user's avatar image.
 * Attempts to delete the uploaded file, then clears the avatar field.
 * @param {Function} updateUser - AuthContext updateUser function
 * @param {string|null} currentAvatarUrl - Current avatar URL to derive filename
 */
const handleRemoveAvatar = async (updateUser, currentAvatarUrl) => {
  try {
    const loadingId = toast.loading("Removing avatar…");

    // Try to delete the file on server if it's one of our uploads
    if (currentAvatarUrl) {
      try {
        const url = new URL(currentAvatarUrl, window.location.origin);
        // Expect path like /uploads/avatars/<filename>
        const parts = url.pathname.split("/");
        const uploadsIdx = parts.indexOf("uploads");
        const type = parts[uploadsIdx + 1];
        const filename = parts[uploadsIdx + 2];
        if (type === "avatars" && filename) {
          await apiClient.delete(`/upload/${type}/${filename}`);
        }
      } catch (_) {
        // Non-fatal: skip file deletion if parsing fails
      }
    }

    // Clear avatar in profile and update context with authoritative response
    const updated = await authService.updateProfile({ avatar: null });
    if (typeof updateUser === "function") {
      updateUser({ avatar: updated.avatar ?? null });
    }

    toast.dismiss(loadingId);
    toast.success("Avatar removed");
  } catch (err) {
    console.error("Remove avatar error", err);
    toast.dismiss();
    toast.error("Could not remove avatar");
  }
};

export default handleRemoveAvatar;
