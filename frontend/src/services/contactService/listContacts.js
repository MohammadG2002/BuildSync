import apiClient from "../apiClient";

// GET /contacts?status=accepted|pending|blocked or comma-separated list
// Default: accepted,blocked (show blocked contacts too)
export const listContacts = async (statuses) => {
  let query = "";
  if (Array.isArray(statuses) && statuses.length) {
    query = `?status=${encodeURIComponent(statuses.join(","))}`;
  } else if (typeof statuses === "string" && statuses.trim()) {
    query = `?status=${encodeURIComponent(statuses)}`;
  } else {
    query = `?status=${encodeURIComponent("accepted,blocked")}`;
  }
  const res = await apiClient.get(`/contacts${query}`);
  // Backend shape: { success, count, data: { contacts: [...] } }
  return res?.data?.contacts || res?.data?.data?.contacts || [];
};
