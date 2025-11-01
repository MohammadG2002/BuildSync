import { API_CONFIG } from "../config/api.config";
import { TokenManager } from "../services/apiClientModule/TokenManager";

/**
 * Programmatically download a file from an authenticated API endpoint
 * without navigating away from the SPA.
 * @param {string} path - API path starting with '/'
 * @param {string} filename - Suggested filename for the download
 */
export async function downloadFromApi(path, filename) {
  const url = `${API_CONFIG.BASE_URL.replace(/\/$/, "")}${path}`;

  const headers = {};
  const token = TokenManager.getToken?.();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const resp = await fetch(url, { method: "GET", headers });
  if (!resp.ok) {
    // Try to surface server message if JSON
    const contentType = resp.headers.get("content-type") || "";
    const errText = contentType.includes("application/json")
      ? JSON.stringify(await resp.json())
      : await resp.text();
    throw new Error(errText || `Download failed with status ${resp.status}`);
  }

  const blob = await resp.blob();
  const link = document.createElement("a");
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  if (filename) link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
