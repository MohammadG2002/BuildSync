import toast from "react-hot-toast";
import apiClient from "../../services/apiClient";
import * as authService from "../../services/authService";

/**
 * Handle avatar upload
 * @param {Function} updateUser - AuthContext updateUser function to merge user state
 */
const handleAvatarUpload = async (updateUser) => {
  try {
    // Create a hidden file input to pick an image
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    const file = await new Promise((resolve) => {
      input.onchange = () => resolve(input.files?.[0] || null);
      input.click();
    });

    if (!file) return; // user cancelled

    // Basic validations
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Image must be under ${maxSizeMB}MB`);
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("avatar", file);

    const loadingId = toast.loading("Uploading avatar…");

    // Upload to backend
    const uploadResp = await apiClient.upload("/upload/avatar", formData, null);

    const uploaded = uploadResp?.data || uploadResp; // FileUploader returns parsed JSON
    const avatarUrl = uploaded?.url || uploaded?.data?.url;
    if (!avatarUrl) {
      toast.dismiss(loadingId);
      toast.error("Failed to upload avatar");
      return;
    }

    // Persist avatar on user profile
    await authService.updateProfile({ avatar: avatarUrl });

    // Update local auth state
    if (typeof updateUser === "function") {
      updateUser({ avatar: avatarUrl });
    }

    toast.dismiss(loadingId);
    toast.success("Avatar updated");
  } catch (err) {
    console.error("Avatar upload error", err);
    toast.dismiss();
    toast.error("Could not update avatar");
  }
};

export default handleAvatarUpload;
