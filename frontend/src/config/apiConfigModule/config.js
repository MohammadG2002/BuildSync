/**
 * API Base Configuration
 */
export const API_CONFIG = {
  // Normalize base URL (no trailing slash). Ensure env var includes '/api' if your backend routes are prefixed.
  BASE_URL: (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  ).replace(/\/$/, ""),
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};
