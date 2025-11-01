/**
 * Build an absolute URL for assets served by the backend.
 * If input is already absolute (http/https), return as-is.
 * Otherwise, prefix with the backend origin derived from API_CONFIG.BASE_URL.
 */
import { API_CONFIG } from "../config/api.config";

export function buildAbsoluteUrl(path) {
  if (!path) return path;
  // Already absolute
  if (/^https?:\/\//i.test(path)) return path;

  // Ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Derive backend origin from BASE_URL (e.g., http://localhost:5000/api -> http://localhost:5000)
  let origin = "";
  try {
    const url = new URL(API_CONFIG.BASE_URL);
    origin = url.origin; // protocol + host + optional port
  } catch {
    // Fallback to current origin if config is malformed
    origin = window.location.origin;
  }

  return `${origin}${normalizedPath}`;
}
